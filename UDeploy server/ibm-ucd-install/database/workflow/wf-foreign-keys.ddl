-- Licensed Materials - Property of IBM Corp.
-- IBM UrbanCode Build
-- IBM UrbanCode Deploy
-- IBM UrbanCode Release
-- IBM AnthillPro
-- (c) Copyright IBM Corporation 2002, 2014. All Rights Reserved.
--
-- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
-- GSA ADP Schedule Contract with IBM Corp.
alter table wf_dispatched_task add constraint wf_fk_tasks_wf foreign key (workflow_id) references wf_workflow(id);
create index wf_metadata_result on wf_workflow_metadata(result);
create index wf_metadata_status on wf_workflow_metadata(status);
create index wf_metadata_start_time on wf_workflow_metadata(start_time);
create index wf_metadata_end_time on wf_workflow_metadata(end_time);
create index wf_metadata_duration_time on wf_workflow_metadata(duration_time);
create index wf_metadata_paused on wf_workflow_metadata(paused);