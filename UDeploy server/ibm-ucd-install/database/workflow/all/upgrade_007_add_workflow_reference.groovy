/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Build
* IBM UrbanCode Deploy
* IBM UrbanCode Release
* IBM AnthillPro
* (c) Copyright IBM Corporation 2002, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
import groovy.sql.Sql;

def connection = this.binding['CONN'];
def sql = new Sql(connection)

final String selectWorkflows = 'SELECT * FROM wf_workflow_trace'

final String selectChildActivities = 'SELECT * FROM wf_activity_trace WHERE parent_activity_trace_id = ?'

final String updateActivity = 'UPDATE wf_activity_trace SET workflow_trace_id = ? WHERE id = ?'

final String selectBadActivities = 'SELECT * FROM wf_activity_trace WHERE workflow_trace_id IS NULL'
final String deleteActivity = 'DELETE FROM wf_activity_trace WHERE id = ?'
final String deleteActivityProps = 'DELETE FROM wf_activity_trace_property WHERE activity_trace_id = ?'

def setWorkflowIdOnChildActivities = null
setWorkflowIdOnChildActivities = { String workflowId, String parentActivityId ->
    sql.execute(updateActivity, [workflowId, parentActivityId])
    sql.eachRow(selectChildActivities, [parentActivityId]) { childActivityRow ->
        def childActivityId = childActivityRow['id']
        setWorkflowIdOnChildActivities(workflowId, childActivityId)
    }
}

def tags = []
sql.eachRow(selectWorkflows) { workflowRow ->
    def workflowId = workflowRow['id']
    def rootActivityId = workflowRow['root_activity_trace_id']
    setWorkflowIdOnChildActivities(workflowId, rootActivityId)
}

// delete rogue entries that would break creation of the foreign key
sql.eachRow(selectBadActivities) { activityRow ->
    def activityTraceId = activityRow['id']
    println "Activity Trace was not associated with a workflow: ${activityRow}"
    sql.execute(deleteActivityProps, [activityTraceId])
    sql.execute(deleteActivity, [activityTraceId])
}
