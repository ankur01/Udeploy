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
import com.urbancode.cm.db.updater.ApplyException;
import java.sql.SQLDataException;

def connection = this.binding['CONN'];
def sql = new Sql(connection)


def updateCmd = { tableName, columnName, newColumnName ->
     return "update $tableName set $newColumnName = ? where $columnName = ?"
}

def remakeBooleanColumnsNumeric = { tableName, columnName, newColumnName ->
    sql.execute(updateCmd(tableName, columnName, newColumnName), ['N', 0]);
    sql.execute(updateCmd(tableName, newColumnName, newColumnName), ['Y', 'P']); //update scripts should default to P for the varchar1 column
}
def remakeBooleanColumns = { tableName, columnName, newColumnName ->
    sql.execute(updateCmd(tableName, columnName, newColumnName), ['N', '0']); 

    sql.execute(updateCmd(tableName, columnName, newColumnName), ['N', 'n']);
    sql.execute(updateCmd(tableName, columnName, newColumnName), ['N', 'N']);
    sql.execute(updateCmd(tableName, columnName, newColumnName), ['N', 'f']);
    sql.execute(updateCmd(tableName, columnName, newColumnName), ['N', 'F']);


    sql.execute(updateCmd(tableName, newColumnName, newColumnName), ['Y', 'P']); //update scripts should default to P for the varchar1 column
}

remakeBooleanColumnsNumeric("wf_workflow_trace_pause", "paused", "pausedtemp");
remakeBooleanColumns("wf_activity_trace_prop", "property_deleted", "property_deleted");
remakeBooleanColumns("wf_dispatched_task", "dispatched", "dispatched");
