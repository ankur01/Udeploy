-- Licensed Materials - Property of IBM Corp.
-- IBM UrbanCode Build
-- IBM UrbanCode Deploy
-- IBM UrbanCode Release
-- IBM AnthillPro
-- (c) Copyright IBM Corporation 2002, 2014. All Rights Reserved.
--
-- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
-- GSA ADP Schedule Contract with IBM Corp.
insert into wf_workflow_trace_root
    (workflow_trace_id, activity_trace_id)
select wt.id, wt.root_activity_trace_id
from wf_workflow_trace wt where wt.root_activity_trace_id is not null;

insert into wf_activity_trace_start
    (id, created_ts, activity_trace_id, started_ts)
select act.id, act.child_index_order, act.id, act.started_on
from wf_activity_trace act
where act.started_on is not null;

insert into wf_activity_trace_end
    (id, created_ts, activity_trace_id, ended_ts)
select act.id, act.child_index_order, act.id, act.ended_on
from wf_activity_trace act
where act.ended_on is not null;

insert into wf_activity_trace_status
    (id, created_ts, activity_trace_id, status)
select act.id, act.child_index_order, act.id, act.execution_status
from wf_activity_trace act;

insert into wf_activity_trace_result
    (id, created_ts, activity_trace_id, result)
select act.id, act.child_index_order, act.id, act.execution_result
from wf_activity_trace act;
