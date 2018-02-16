-- Licensed Materials - Property of IBM Corp.
-- IBM UrbanCode Deploy
-- (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
--
-- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
-- GSA ADP Schedule Contract with IBM Corp.
--**************************************************************************************************
-- Calendar
--**************************************************************************************************

create table cal_calendar (
    id varchar2(36) not null primary key,
    version numeric default 0 not null
);

create table cal_entry (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255),
    scheduled_date numeric not null,
    fired varchar2(1) not null,
    event_data clob not null,
    cancelled varchar2(1) default 'N' not null
);

create table cal_blackout (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    calendar_id varchar2(36) not null,
    name varchar2(255),
    start_date numeric not null,
    end_date numeric not null
);

create table cal_entry_to_calendar (
    calendar_id varchar2(36) not null,
    entry_id varchar2(36) not null
);

create table cal_recurring_entry (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255),
    recurrence_pattern varchar2(255),
    scheduled_date numeric not null,
    event_data clob not null
);

create table cal_recurring_entry_to_cal (
    calendar_id varchar2(36) not null,
    recurring_entry_id varchar2(36) not null
);



--**************************************************************************************************
-- Deploy Server
--**************************************************************************************************

create table ds_db_version (
    release_name varchar2(255) not null,
    ver numeric default 0 not null
);

create table ds_tag (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    description varchar2(255),
    color varchar2(10),
    object_type varchar2(64) not null
);



-----------------------
-- Resource
-----------------------

create table ds_agent (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    active varchar2(1) not null,
    description varchar2(255),
    error_data clob,
    ghosted_date numeric default 0 not null,
    endpoint_id varchar2(64),
    relay_id varchar2(64),
    agent_version varchar2(32),
    last_status varchar2(16),
    working_directory varchar2(255),
    sec_resource_id varchar2(36) not null,
    impersonation_user varchar2(255),
    impersonation_group varchar2(255),
    impersonation_password varchar2(255),
    impersonation_sudo varchar2(1),
    impersonation_force varchar2(1),
    license_type varchar2(16) default 'NONE' not null,
    last_properties_hash numeric,
    last_contact numeric,
    apikey_id varchar2(36),
    jms_cert clob
);

create table ds_apikey (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    apikey varchar2(64) not null,
    secretkey varchar2(255) not null,
    sec_user_id varchar2(36) not null,
    disabled varchar2(1) default 'N' not null,
    date_created numeric not null,
    expiration numeric default 0 not null
);

create table ds_agent_test_result (
    id varchar2(36) not null primary key,
    test_result varchar2(2000)
);

create table ds_agent_request_record (
        id varchar2(36) not null primary key,
        version numeric default 0 not null,
        agent_id varchar2(36) not null,
        request_id varchar2(36) not null
);

create table ds_agent_to_tag (
    agent_id varchar2(36) not null,
    tag_id varchar2(36) not null
);

create table ds_agent_pool (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    active varchar2(1) not null,
    description varchar2(255),
    ghosted_date numeric default 0 not null,
    sec_resource_id varchar2(36) not null
);

create table ds_agent_to_pool (
    agent_id varchar2(36) not null,
    pool_id varchar2(36) not null
);

create table ds_resource (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    path varchar2(1000) default '/' not null,
    active varchar2(1) not null,
    description varchar2(255),
    agent_id varchar2(36),
    agent_pool_id varchar2(36),
    component_tag_id varchar2(36),
    parent_id varchar2(36),
    resource_template_id varchar2(36),
    role_id varchar2(36),
    sec_resource_id varchar2(36) not null,
    ghosted_date numeric default 0 not null,
    inherit_team varchar2(1) not null,
    impersonation_user varchar2(255),
    impersonation_group varchar2(255),
    impersonation_password varchar2(255),
    impersonation_sudo varchar2(1),
    impersonation_force varchar2(1),
    discovery_failed varchar2(1) default 'N' not null,
    prototype varchar2(1) default 'N' not null
);

--Index is added here because it does not apply to all database types
create index ds_resource_ghosted_path on ds_resource(ghosted_date, path);


create table ds_resource_template (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    description varchar2(1000),
    parent_id varchar2(36),
    application_id varchar2(36),
    sec_resource_id varchar2(36) not null,
    ghosted_date numeric default 0 not null,
    prop_sheet_id varchar2(36) not null,
    prop_sheet_def_id varchar2(36) not null
);

create table ds_cloud_connection (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    url varchar2(255) not null,
    username varchar2(255) not null,
    password varchar2(255) not null,
    description varchar2(1000),
    sec_resource_id varchar2(36) not null,
    ghosted_date numeric default 0 not null,
    prop_sheet_id varchar2(36) not null,
    prop_sheet_def_id varchar2(36) not null
);

create table ds_resource_role (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    special_type varchar2(20),
    description varchar2(255),
    prop_sheet_def_id varchar2(36) not null,
    default_name_property varchar2(255)
);

create table ds_res_role_allowed_parent (
    id varchar2(36) not null primary key,
    resource_role_id varchar2(36) not null,
    allowed_parent_id varchar2(36) not null,
    foldername varchar2(255),
    allowed_name varchar2(255)
);

create table ds_res_role_default_child (
  resource_role_id varchar2(36) not null,
  child_folder_name varchar2(255) not null
);

create table ds_resource_to_tag (
    resource_id varchar2(36) not null,
    tag_id varchar2(36) not null
);

create table ds_discovery_execution (
    id varchar2(36) not null primary key,
    command_id varchar2(36),
    resource_id varchar2(36),
    agent_id varchar2(36),
    status varchar2(16),
    start_time numeric,
    end_time numeric,
    auth_token varchar2(255),
    request_time numeric,
    acked varchar2(1) default 'N' not null,
    action varchar2(16)
);

create table ds_agent_relay (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255),
    endpoint_id varchar2(64) not null,
    description varchar2(255),
    relay_version varchar2(36),
    hostname varchar2(255),
    relay_hostname varchar2(255),
    jms_port int default 0 not null,
    status varchar2(16),
    last_contact numeric,
    sec_resource_id varchar2(36)
);


-----------------------
-- Components
-----------------------

create table ds_component (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    active varchar2(1) not null,
    ghosted_date numeric default 0 not null,
    description varchar2(255),
    component_type varchar2(16) default 'STANDARD' not null,
    date_created numeric not null,
    created_by_user varchar2(64) not null,
    resource_role_id varchar2(36) not null,
    source_config_plugin varchar2(36),
    import_automatically varchar2(1) not null,
    use_vfs varchar2(1) not null,
    sec_resource_id varchar2(36) not null,
    calendar_id varchar2(36) not null,
    template_id varchar2(36),
    template_version numeric,
    cleanup_days_to_keep numeric default 0 not null,
    cleanup_count_to_keep numeric default 0 not null,
    default_version_type varchar2(64) not null,
    version_creation_process_id varchar2(36),
    version_creation_env_id varchar2(36),
    integration_agent_id varchar2(36),
    integration_tag_id varchar2(36),
    integration_failed varchar2(1) not null,
    ignore_qualifiers numeric default 0 not null,
    last_modified numeric default 0 not null
);

create table ds_component_to_tag (
    component_id varchar2(36) not null,
    tag_id varchar2(36) not null
);


-----------------------
-- Component Versions
-----------------------

create table ds_version (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    active varchar2(1) not null,
    archived varchar2(1) default 0 not null,
    description varchar2(255),
    component_id varchar2(36) not null,
    date_created numeric not null,
    created_by_user varchar2(64) not null,
    version_type varchar2(64) not null,
    size_on_disk numeric default 0 not null,
    last_modified numeric default 0 not null,
    creation_process_requested varchar2(1) default 'N' not null
);

-------------------------
-- this is just to be consistent with what the upgrade does
-------------------------

create table ds_version_upgrade (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    locked varchar2(1) default 'N' not null,
    upgraded varchar2(1) default 'N' not null
);


-----------------------
-- Version Statuses
-----------------------

create table ds_version_status (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    version_id varchar2(36) not null,
    status_name varchar2(36) not null,
    date_created numeric not null,
    created_by_user varchar2(64) not null
);


-----------------------
-- Notification Schemes
-----------------------

create table ds_notification_scheme (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    description varchar2(255)
);

create table ds_notification_entry (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    resource_type_id varchar2(64) not null,
    resource_role_id varchar2(64),
    role_id varchar2(64) not null,
    entry_type varchar2(64) not null,
    notification_scheme_id varchar2(36) not null,
    template_name varchar2(255)
);


-----------------------
-- Applications
-----------------------

create table ds_application (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    ghosted_date numeric default 0 not null,
    active varchar2(1) not null,
    description varchar2(255),
    enforce_complete_snapshots varchar2(1) default 'Y' not null,
    date_created numeric not null,
    created_by_user varchar2(64) not null,
    calendar_id varchar2(36) not null,
    notification_scheme_id varchar2(36),
    sec_resource_id varchar2(36) not null,
    last_modified numeric default 0 not null,
    template_id varchar2(36),
    template_version numeric
);

create table ds_application_to_component (
    application_id varchar2(36) not null,
    component_id varchar2(36) not null
);

create table ds_application_to_tag (
    application_id varchar2(36) not null,
    tag_id varchar2(36) not null
);


-----------------------
-- Environments
-----------------------

create table ds_environment (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    active varchar2(1) not null,
    index_order numeric not null,
    description varchar2(255),
    color varchar2(10),
    application_id varchar2(36) not null,
    calendar_id varchar2(36) not null,
    resource_template_id varchar2(36),
    instance_id varchar2(64),
    require_approvals varchar2(1) not null,
    exempt_process_ids varchar2(4000),
    lock_snapshots varchar2(1) not null,
    snapshot_lock_type varchar2(64),
    approval_process_id varchar2(36),
    sec_resource_id varchar2(36) not null,
    cleanup_days_to_keep numeric default 0 not null,
    ghosted_date numeric default 0 not null,
    cleanup_count_to_keep numeric default 0 not null,
    history_days_to_keep numeric default 365 not null,
    last_modified numeric default 0 not null,
    template_id varchar2(36),
    template_version numeric,
    enable_process_history_cleanup varchar2(1) default 'N' not null,
    use_system_default_days varchar2(1) default 'Y' not null,
    no_self_approvals varchar2(1) default 'N' not null
);

create table ds_environment_to_resource (
    environment_id varchar2(36) not null,
    resource_id varchar2(36) not null
);

create table ds_prop_cmp_env_mapping (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    environment_id varchar2(36) not null,
    component_id varchar2(36) not null,
    prop_sheet_id varchar2(36) not null
);

create table ds_env_ver_condition (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    environment_id varchar2(36) not null,
    index_order numeric not null,
    value varchar2(255) not null
);



-----------------------
-- Snapshots
-----------------------

create table ds_snapshot (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    active varchar2(1) not null,
    ghosted_date numeric default 0 not null,
    description varchar2(255),
    date_created numeric not null,
    created_by_user varchar2(64) not null,
    application_id varchar2(36) not null,
    calendar_id varchar2(36) not null,
    prop_sheet_id varchar2(36) not null,
    versions_locked varchar2(1) not null,
    config_locked varchar2(1) not null,
    last_modified numeric default 0 not null
);

create table ds_snapshot_to_version (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    snapshot_id varchar2(36) not null,
    version_id varchar2(36) not null,
    role_id varchar2(36),
    index_order numeric
);

create table ds_snapshot_config_version (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    snapshot_id varchar2(36) not null,
    path varchar2(255) not null,
    persistent_version numeric
);

create table ds_snapshot_status (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    snapshot_id varchar2(36) not null,
    status_name varchar2(36) not null,
    date_created numeric not null,
    created_by_user varchar2(64) not null
);



-----------------------
-- Statuses
-----------------------

create table ds_status (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    ghosted_date numeric default 0 not null,
    description varchar2(255),
    color varchar2(10),
    status_type varchar2(64),
    unique_status varchar2(1) not null,
    role_id varchar2(36)
);



-----------------------
-- Processes
-----------------------

create table ds_copied_activity (
    id varchar2(36) not null primary key,
    user_id varchar2(64) not null,
    version numeric default 0 not null,
    label varchar2(255),
    activity_data clob not null
);



--**************************************************************************************************
-- Runtime Classes
--**************************************************************************************************

-----------------------
-- Property Contexts
-----------------------

create table rt_property_context (
    id varchar2(36) primary key not null,
    version numeric default 0 not null,
    prop_sheet_id varchar2(36) not null
);

create table rt_property_context_group_map (
    id varchar2(36) primary key not null,
    version numeric default 0 not null,
    property_context_id varchar2(36) not null,
    prefix varchar2(255) not null,
    prop_sheet_id varchar2(36),
    prop_sheet_handle varchar2(255),
    index_order numeric not null
);


-----------------------
-- Requests
-----------------------

create table rt_process_request (
    id varchar2(36) primary key not null,
    version numeric default 0 not null,
    user_id varchar2(64) not null,
    submitted_time numeric not null,
    property_context_id varchar2(36) not null,
    process_path varchar2(255) not null,
    process_version numeric not null,
    trace_id varchar2(36),
    result varchar2(32)
);

create table rt_deployment_request (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    app_process_request_id varchar2(36) not null
);

create table rt_app_process_request (
    id varchar2(36) primary key not null,
    version numeric default 0 not null,
    deployment_request_id varchar2(36),
    user_id varchar2(64) not null,
    submitted_time numeric not null,
    application_id varchar2(36) not null,
    environment_id varchar2(36) not null,
    property_context_id varchar2(36) not null,
    calendar_entry_id varchar2(36) not null,
    approval_id varchar2(36),
    application_process_id varchar2(36) not null,
    application_process_version numeric not null,
    snapshot_id varchar2(36),
    trace_id varchar2(36),
    only_changed varchar2(1) not null,
    description varchar2(255),
    result varchar2(32)
);

create table rt_app_proc_req_to_version (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    app_process_request_id varchar2(36) not null,
    version_id varchar2(36) not null,
    role_id varchar2(36),
    index_order numeric
);

create table rt_version_selector (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    value varchar2(255) not null,
    application_process_request_id varchar2(36),
    component_id varchar2(36) not null,
    environment_id varchar2(36) not null,
    role_id varchar2(36),
    snapshot_id varchar2(36)
);

create table rt_comp_process_request (
    id varchar2(36) primary key not null,
    version numeric default 0 not null,
    user_id varchar2(64) not null,
    submitted_time numeric not null,
    application_id varchar2(36) not null,
    environment_id varchar2(36) not null,
    property_context_id varchar2(36) not null,
    calendar_entry_id varchar2(36) not null,
    approval_id varchar2(36),
    component_id varchar2(36) not null,
    component_process_id varchar2(36) not null,
    component_process_version numeric not null,
    version_id varchar2(36),
    resource_id varchar2(36) not null,
    agent_id varchar2(36) not null,
    trace_id varchar2(36),
    parent_request_id varchar2(36),
    continuation varchar2(73),
    result varchar2(32)
);

create table rt_stack_execution_record (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    resource_data clob,
    last_updated numeric not null,
    result varchar2(32),
    app_process_request_id varchar2(36) not null,
    continuation varchar2(73) not null,
    stack_id varchar2(36) not null,
    provider_id varchar2(36) not null
);

create table rt_deletable_trace (
    id varchar2(36) not null primary key
);

--**************************************************************************************************
-- Manual Tasks
--**************************************************************************************************

create table tsk_approval (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255) not null,
    started_by_user_id varchar2(64) not null,
    prop_sheet_id varchar2(36) not null,
    failed varchar2(1) not null,
    failed_by_user varchar2(64),
    failed_comment varchar2(4000),
    date_failed numeric
);

create table tsk_task (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    classname varchar2(255) not null,
    name varchar2(255) not null,
    comment_prompt varchar2(1024),
    comment_required varchar2(1),
    completed_by_user varchar2(64),
    task_comment varchar2(4000),
    date_started numeric,
    date_ended numeric,
    status varchar2(64) not null,
    prop_sheet_id varchar2(36) not null,
    prop_sheet_def_id varchar2(36) not null
);

create table tsk_task_resource_role_map (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    task_id varchar2(36) not null,
    sec_resource_role_id varchar2(64),
    sec_resource_id varchar2(64) not null,
    sec_role_id varchar2(64) not null
);

create table tsk_task_member_map (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    task_id varchar2(36) not null,
    sec_user_id varchar2(64),
    sec_group_id varchar2(64)
);

create table tsk_approval_to_task (
    approval_id varchar2(36) not null,
    task_id varchar2(36) not null
);



--**************************************************************************************************
-- Plugin System
--**************************************************************************************************

create table pl_plugin (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255),
    tag varchar2(255),
    description varchar2(4000),
    plugin_id varchar2(255) not null,
    plugin_version numeric not null,
    ghosted_date numeric default 0 not null,
    plugin_hash varchar2(255),
    release_version varchar2(255)
);

create table pl_plugin_command (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255),
    sub_tag varchar2(4000),
    description varchar2(4000),
    plugin_id varchar2(36) not null,
    type varchar2(255),
    role_id varchar2(36),
    prop_sheet_def_id varchar2(36) not null
);

create table pl_command_to_resource_role (
    command_id varchar2(36) not null,
    resource_role_id varchar2(36) not null
);

create table pl_plugin_role (
    plugin_id varchar2(36) not null,
    role_id varchar2(36) not null
);

create table ds_plugin_task_request (
    workflow_id varchar(36) not null,
    activity_trace_id varchar(36) not null,
    activity_name varchar2(255) not null,
    property_context_id varchar2(36) not null,
    failure_continuation varchar2(73) not null,
    success_continuation varchar2(73) not null,
    dialogue_id varchar(36) not null primary key,
    version integer default 0 not null,
    agent_id varchar2(36),
    request_time numeric,
    last_resend_time numeric,
    resend_message blob,
    acked varchar2(1) default 'N' not null
);

create table pl_source_config_plugin (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    name varchar2(255),
    tag varchar2(255),
    description varchar2(4000),
    plugin_id varchar2(255) not null,
    plugin_version numeric not null,
    ghosted_date numeric default 0 not null,
    plugin_hash varchar2(255),
    release_version varchar2(255),
    comp_prop_sheet_id varchar2(36),
    import_prop_sheet_id varchar2(36)
);

create table pl_source_config_execution (
    id varchar2(36) not null primary key,
    task_info varchar2(255),
    component_id varchar2(36),
    agent_id varchar2(36),
    start_time numeric,
    end_time numeric,
    status varchar2(16),
    auth_token varchar2(255),
    input_properties clob,
    request_time numeric,
    acked varchar2(1) default 'N' not null
);


--**************************************************************************************************
-- Licensing and agent data
--**************************************************************************************************

create table ds_agent_data (
    agent_data varchar2(255) not null
);

create table ds_license_log_entry (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    message varchar2(4000) not null,
    violation_time numeric not null,
    dismissed varchar2(1) default 'N' not null
);


--**************************************************************************************************
-- Network data
--**************************************************************************************************

create table ds_network_relay (
    id varchar2(36) not null primary key,
    version integer default 0 not null,
    name varchar2(255) not null,
    active varchar2(1) not null,
    host varchar2(255) not null,
    port numeric not null
);


--**************************************************************************************************
-- Reporting
--**************************************************************************************************

create table ds_recent_report (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    user_id varchar2(64) not null,
    report_type varchar2(255) not null,
    report_name varchar2(255) not null,
    last_run numeric not null
);

create table rp_app_req_plugin (
    app_request_id varchar2(255) not null,
    plugin_name varchar2(255) not null
);

--**************************************************************************************************
-- Locking
--**************************************************************************************************

create table ds_ptr_store_lock(
    id numeric not null primary key
);

create table ds_lockable (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    lock_name varchar2(4000) not null,
    max_permits numeric default 1 not null
);

create table ds_lock (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    acquirer varchar2(36) not null,
    success_continuation varchar2(73),
    failure_continuation varchar2(73),
    acquired varchar2(1) not null,
    lockable varchar2(36) not null,
    date_created numeric default 0 not null
);

create table ds_comp_ver_int_rec (
   id varchar2(36) not null primary key
);

create table ds_vfs_repo_rec (
   id varchar2(36) not null primary key
);

create table ds_audit_entry (
   id varchar2(36) not null primary key,
   version numeric default 0 not null,
   user_id varchar2(64),
   user_name varchar2(255),
   event_type varchar2(255) not null,
   description varchar2(255),
   obj_type varchar2(255),
   obj_name varchar2(255),
   obj_id varchar2(255),
   created_date numeric not null,
   status varchar2(255) not null,
   deletable varchar2(1) default 'Y',
   ip_address varchar2(40)
);

create table ds_request_audit_entry (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    user_id varchar2(36),
    short_url varchar2(255) not null,
    full_url varchar2(4000) not null,
    duration numeric not null,
    method varchar2(10) not null,
    date_created numeric not null
);

create table ds_sync (
    name varchar2(255) not null primary key,
    locked varchar2(1) not null,
    value varchar2(255)
);


--**************************************************************************************************
-- Integration
--**************************************************************************************************

create table ds_integration_provider (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    date_created numeric not null,
    classname varchar2(255) not null,
    name varchar2(255) not null,
    description varchar2(4000),
    prop_sheet_id varchar2(36) not null,
    ghosted_date numeric default 0 not null
);

create table ds_ext_environment (
    id varchar2(36) not null primary key,
    ext_id varchar2(36) not null,
    name varchar2(255) not null,
    version numeric default 0 not null,
    environment_id varchar2(36) not null,
    date_created numeric not null,
    ext_blueprint_id varchar2(255),
    ext_blueprint_name varchar2(255) not null,
    ext_blueprint_version varchar2(36),
    ext_blueprint_url varchar2(255),
    ext_configuration_id varchar2(255),
    ext_configuration_name varchar2(255),
    ext_configuration_version varchar2(36),
    integration_provider_id varchar2(36),
    prop_sheet_id varchar2(36) not null,
    ghosted_date numeric default 0 not null
);

--**************************************************************************************************
-- History Cleanup
--**************************************************************************************************

create table ds_history_cleanup_record (
    id varchar2(36) not null primary key,
    version numeric default 0 not null,
    total_deployments_for_cleanup numeric not null,
    deployments_deleted numeric default 0 not null,
    date_cleanup_started numeric not null,
    date_cleanup_finished numeric
);
