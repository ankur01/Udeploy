-- Licensed Materials - Property of IBM Corp.
-- IBM UrbanCode Build
-- IBM UrbanCode Deploy
-- IBM UrbanCode Release
-- IBM AnthillPro
-- (c) Copyright IBM Corporation 2002, 2014. All Rights Reserved.
--
-- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
-- GSA ADP Schedule Contract with IBM Corp.
create table wf_db_version (
    release_name nvarchar(256) not null,
    ver integer default 0 not null
);

create table wf_workflow (
    id nvarchar(36) not null primary key,  
    workflow_data varbinary(max) not null
);

create table wf_dispatched_task (
    id nvarchar(36) not null primary key,
    workflow_id nvarchar(36) not null,
    context_id nvarchar(36) not null,
    dispatched nvarchar(1) not null,
    method_name nvarchar(128) not null,
    priority integer not null,  
    method_data varbinary(max)
); 

create table wf_workflow_trace (
    id nvarchar(36) not null primary key,
    workflow_trace_data ntext not null,
    format int
);

create table wf_workflow_metadata (
    workflow_trace_id nvarchar(36) not null primary key,
    result nvarchar(32),
    status nvarchar(32),
    start_time bigint,
    end_time bigint,
    duration_time bigint,
    paused nvarchar(1) not null
);

create index wf_disp_task_wfid on wf_dispatched_task(workflow_id);
