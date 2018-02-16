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
    id nvarchar(36) not null primary key,
    version int default 0 not null
);

create table cal_entry (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255),
    scheduled_date bigint not null,
    fired nvarchar(1) not null,
    event_data ntext not null,
    cancelled nvarchar(1) default 'N' not null
);

create table cal_blackout (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    calendar_id nvarchar(36) not null,
    name nvarchar(255),
    start_date bigint not null,
    end_date bigint not null
);

create table cal_entry_to_calendar (
    calendar_id nvarchar(36) not null,
    entry_id nvarchar(36) not null
);

create table cal_recurring_entry (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255),
    recurrence_pattern nvarchar(255),
    scheduled_date bigint not null,
    event_data ntext not null
);

create table cal_recurring_entry_to_cal (
    calendar_id nvarchar(36) not null,
    recurring_entry_id nvarchar(36) not null
);



--**************************************************************************************************
-- Deploy Server
--**************************************************************************************************

create table ds_db_version (
    release_name nvarchar(255) not null,
    ver int default 0 not null
);

create table ds_tag (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    description nvarchar(255),
    color nvarchar(10),
    object_type nvarchar(64) not null
);



-----------------------
-- Resource
-----------------------

create table ds_agent (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    active nvarchar(1) not null,
    description nvarchar(255),
    error_data ntext,
    ghosted_date bigint default 0 not null,
    endpoint_id nvarchar(64),
    relay_id nvarchar(64),
    agent_version nvarchar(32),
    last_status nvarchar(16),
    working_directory nvarchar(255),
    sec_resource_id nvarchar(36) not null,
    impersonation_user nvarchar(255),
    impersonation_group nvarchar(255),
    impersonation_password nvarchar(255),
    impersonation_sudo nvarchar(1),
    impersonation_force nvarchar(1),
    license_type nvarchar(16) default 'NONE' not null,
    last_properties_hash int,
    last_contact bigint,
    apikey_id nvarchar(36),
    jms_cert ntext
);

create table ds_apikey (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    apikey nvarchar(64) not null,
    secretkey nvarchar(255) not null,
    sec_user_id nvarchar(36) not null,
    disabled nvarchar(1) default 'N' not null,
    date_created bigint not null,
    expiration bigint default 0 not null
);

create table ds_agent_test_result (
    id nvarchar(36) not null primary key,
    test_result nvarchar(2000)
);

create table ds_agent_request_record (
        id nvarchar(36) not null primary key,
        version int default 0 not null,
        agent_id nvarchar(36) not null,
        request_id nvarchar(36) not null
);

create table ds_agent_to_tag (
    agent_id nvarchar(36) not null,
    tag_id nvarchar(36) not null
);

create table ds_agent_pool (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    active nvarchar(1) not null,
    description nvarchar(255),
    ghosted_date bigint default 0 not null,
    sec_resource_id nvarchar(36) not null
);

create table ds_agent_to_pool (
    agent_id nvarchar(36) not null,
    pool_id nvarchar(36) not null
);

create table ds_resource (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    path nvarchar(1000) default '/' not null,
    active nvarchar(1) not null,
    description nvarchar(255),
    agent_id nvarchar(36),
    agent_pool_id nvarchar(36),
    component_tag_id nvarchar(36),
    parent_id nvarchar(36),
    resource_template_id nvarchar(36),
    role_id nvarchar(36),
    sec_resource_id nvarchar(36) not null,
    ghosted_date bigint default 0 not null,
    inherit_team nvarchar(1) not null,
    impersonation_user nvarchar(255),
    impersonation_group nvarchar(255),
    impersonation_password nvarchar(255),
    impersonation_sudo nvarchar(1),
    impersonation_force nvarchar(1),
    discovery_failed nvarchar(1) default 'N' not null,
    prototype nvarchar(1) default 'N' not null
);

--Index is added here because it does not apply to all database types
create index ds_resource_ghosted_path on ds_resource(ghosted_date, path);

create table ds_resource_template (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    description nvarchar(1000),
    parent_id nvarchar(36),
    application_id nvarchar(36),
    sec_resource_id nvarchar(36) not null,
    ghosted_date bigint default 0 not null,
    prop_sheet_id nvarchar(36) not null,
    prop_sheet_def_id nvarchar(36) not null
);

create table ds_cloud_connection (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    url nvarchar(255) not null,
    username nvarchar(255) not null,
    password nvarchar(255) not null,
    description nvarchar(1000),
    sec_resource_id nvarchar(36) not null,
    ghosted_date bigint default 0 not null,
    prop_sheet_id nvarchar(36) not null,
    prop_sheet_def_id nvarchar(36) not null
);

create table ds_resource_role (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    special_type nvarchar(20),
    description nvarchar(255),
    prop_sheet_def_id nvarchar(36) not null,
    default_name_property nvarchar(255)
);

create table ds_res_role_allowed_parent (
    id nvarchar(36) not null,
    resource_role_id nvarchar(36) not null,
    allowed_parent_id nvarchar(36) not null,
    foldername nvarchar(255),
    allowed_name nvarchar(255)
);

create table ds_res_role_default_child (
  resource_role_id nvarchar(36) not null,
  child_folder_name nvarchar(255) not null
);

create table ds_resource_to_tag (
    resource_id nvarchar(36) not null,
    tag_id nvarchar(36) not null
);

create table ds_discovery_execution (
    id nvarchar(36) not null primary key,
    command_id nvarchar(36),
    resource_id nvarchar(36),
    agent_id nvarchar(36),
    status nvarchar(16),
    start_time bigint,
    end_time bigint,
    auth_token nvarchar(255),
    request_time bigint,
    acked nvarchar(1) default 'N' not null,
    action nvarchar(16)
);

create table ds_agent_relay (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255),
    endpoint_id nvarchar(64) not null,
    description nvarchar(255),
    relay_version nvarchar(36),
    hostname nvarchar(255),
    relay_hostname nvarchar(255),
    jms_port int default 0 not null,
    status nvarchar(16),
    last_contact bigint,
    sec_resource_id nvarchar(36)
);


-----------------------
-- Components
-----------------------

create table ds_component (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    active nvarchar(1) not null,
    ghosted_date bigint default 0 not null,
    description nvarchar(255),
    component_type nvarchar(16) default 'STANDARD' not null,
    date_created bigint not null,
    created_by_user nvarchar(64) not null,
    resource_role_id nvarchar(36) not null,
    source_config_plugin nvarchar(36),
    import_automatically nvarchar(1) not null,
    use_vfs nvarchar(1) not null,
    sec_resource_id nvarchar(36) not null,
    calendar_id nvarchar(36) not null,
    template_id nvarchar(36),
    template_version bigint,
    cleanup_days_to_keep int default 0 not null,
    cleanup_count_to_keep int default 0 not null,
    default_version_type nvarchar(64) not null,
    version_creation_process_id nvarchar(36),
    version_creation_env_id nvarchar(36),
    integration_agent_id nvarchar(36),
    integration_tag_id nvarchar(36),
    integration_failed nvarchar(1) not null,
    ignore_qualifiers int default 0 not null,
    last_modified bigint default 0 not null
);

create table ds_component_to_tag (
    component_id nvarchar(36) not null,
    tag_id nvarchar(36) not null
);


-----------------------
-- Component Versions
-----------------------

create table ds_version (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    active nvarchar(1) not null,
    archived nvarchar(1) default 0 not null,
    description nvarchar(255),
    component_id nvarchar(36) not null,
    date_created bigint not null,
    created_by_user nvarchar(64) not null,
    version_type nvarchar(64) not null,
    size_on_disk bigint default 0 not null,
    last_modified bigint default 0 not null,
    creation_process_requested nvarchar(1) default 'N' not null
);

-------------------------
-- this is just to be consistent with what the upgrade does
-------------------------

create table ds_version_upgrade (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    locked nvarchar(1) default 'N' not null,
    upgraded nvarchar(1) default 'N' not null
);


-----------------------
-- Version Statuses
-----------------------

create table ds_version_status (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    version_id nvarchar(36) not null,
    status_name nvarchar(36) not null,
    date_created bigint not null,
    created_by_user nvarchar(64) not null
);


-----------------------
-- Notification Schemes
-----------------------

create table ds_notification_scheme (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    description nvarchar(255)
);

create table ds_notification_entry (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    resource_type_id nvarchar(64) not null,
    resource_role_id nvarchar(64),
    role_id nvarchar(64) not null,
    entry_type nvarchar(64) not null,
    notification_scheme_id nvarchar(36) not null,
    template_name nvarchar(255)
);


-----------------------
-- Applications
-----------------------

create table ds_application (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    ghosted_date bigint default 0 not null,
    active nvarchar(1) not null,
    description nvarchar(255),
    enforce_complete_snapshots nvarchar(1) default 'Y' not null,
    date_created bigint not null,
    created_by_user nvarchar(64) not null,
    calendar_id nvarchar(36) not null,
    notification_scheme_id nvarchar(36),
    sec_resource_id nvarchar(36) not null,
    last_modified bigint default 0 not null,
    template_id nvarchar(36),
    template_version bigint
);

create table ds_application_to_component (
    application_id nvarchar(36) not null,
    component_id nvarchar(36) not null
);

create table ds_application_to_tag (
    application_id nvarchar(36) not null,
    tag_id nvarchar(36) not null
);


-----------------------
-- Environments
-----------------------

create table ds_environment (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    active nvarchar(1) not null,
    index_order int not null,
    description nvarchar(255),
    color nvarchar(10),
    application_id nvarchar(36) not null,
    calendar_id nvarchar(36) not null,
    resource_template_id nvarchar(36),
    instance_id nvarchar(64),
    require_approvals nvarchar(1) not null,
    exempt_process_ids nvarchar(4000),
    lock_snapshots nvarchar(1) not null,
    snapshot_lock_type nvarchar(64),
    approval_process_id nvarchar(36),
    sec_resource_id nvarchar(36) not null,
    cleanup_days_to_keep int default 0 not null,
    ghosted_date bigint default 0 not null,
    cleanup_count_to_keep int default 0 not null,
    history_days_to_keep bigint default 365 not null,
    last_modified bigint default 0 not null,
    template_id nvarchar(36),
    template_version bigint,
    enable_process_history_cleanup nvarchar(1) default 'N' not null,
    use_system_default_days nvarchar(1) default 'Y' not null,
    no_self_approvals nvarchar(1) default 'N' not null
);

create table ds_environment_to_resource (
    environment_id nvarchar(36) not null,
    resource_id nvarchar(36) not null
);

create table ds_prop_cmp_env_mapping (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    environment_id nvarchar(36) not null,
    component_id nvarchar(36) not null,
    prop_sheet_id nvarchar(36) not null
);

create table ds_env_ver_condition (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    environment_id nvarchar(36) not null,
    index_order int not null,
    value nvarchar(255) not null
);

-----------------------
-- Snapshots
-----------------------

create table ds_snapshot (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    active nvarchar(1) not null,
    ghosted_date bigint default 0 not null,
    description nvarchar(255),
    date_created bigint not null,
    created_by_user nvarchar(64) not null,
    application_id nvarchar(36) not null,
    calendar_id nvarchar(36) not null,
    prop_sheet_id nvarchar(36) not null,
    versions_locked nvarchar(1) not null,
    config_locked nvarchar(1) not null,
    last_modified bigint default 0 not null
);

create table ds_snapshot_to_version (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    snapshot_id nvarchar(36) not null,
    version_id nvarchar(36) not null,
    role_id nvarchar(36),
    index_order int
);

create table ds_snapshot_config_version (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    snapshot_id nvarchar(36) not null,
    path nvarchar(255) not null,
    persistent_version int
);

create table ds_snapshot_status (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    snapshot_id nvarchar(36) not null,
    status_name nvarchar(36) not null,
    date_created bigint not null,
    created_by_user nvarchar(64) not null
);



-----------------------
-- Statuses
-----------------------

create table ds_status (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    ghosted_date bigint default 0 not null,
    description nvarchar(255),
    color nvarchar(10),
    status_type nvarchar(64),
    unique_status nvarchar(1) not null,
    role_id nvarchar(36)
);




-----------------------
-- Processes
-----------------------

create table ds_copied_activity (
    id nvarchar(36) not null primary key,
    user_id nvarchar(64) not null,
    version numeric default 0 not null,
    label nvarchar(255),
    activity_data ntext not null
);



--**************************************************************************************************
-- Runtime Classes
--**************************************************************************************************

-----------------------
-- Property Contexts
-----------------------

create table rt_property_context (
    id nvarchar(36) primary key not null,
    version int default 0 not null,
    prop_sheet_id nvarchar(36) not null
);

create table rt_property_context_group_map (
    id nvarchar(36) primary key not null,
    version int default 0 not null,
    property_context_id nvarchar(36) not null,
    prefix nvarchar(255) not null,
    prop_sheet_id nvarchar(36),
    prop_sheet_handle nvarchar(255),
    index_order bigint not null
);


-----------------------
-- Requests
-----------------------

create table rt_process_request (
    id nvarchar(36) primary key not null,
    version int default 0 not null,
    user_id nvarchar(64) not null,
    submitted_time bigint not null,
    property_context_id nvarchar(36) not null,
    process_path nvarchar(255) not null,
    process_version bigint not null,
    trace_id nvarchar(36),
    result nvarchar(32)
);

create table rt_deployment_request (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    app_process_request_id nvarchar(36) not null
);

create table rt_app_process_request (
    id nvarchar(36) primary key not null,
    version int default 0 not null,
    deployment_request_id nvarchar(36),
    user_id nvarchar(64) not null,
    submitted_time bigint not null,
    application_id nvarchar(36) not null,
    environment_id nvarchar(36) not null,
    property_context_id nvarchar(36) not null,
    calendar_entry_id nvarchar(36) not null,
    approval_id nvarchar(36),
    application_process_id nvarchar(36) not null,
    application_process_version bigint not null,
    snapshot_id nvarchar(36),
    trace_id nvarchar(36),
    only_changed nvarchar(1) not null,
    description nvarchar(255),
    result nvarchar(32)
);

create table rt_app_proc_req_to_version (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    app_process_request_id nvarchar(36) not null,
    version_id nvarchar(36) not null,
    role_id nvarchar(36),
    index_order int
);

create table rt_version_selector (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    value nvarchar(255) not null,
    application_process_request_id nvarchar(36),
    component_id nvarchar(36) not null,
    environment_id nvarchar(36) not null,
    role_id nvarchar(36),
    snapshot_id nvarchar(36)
);

create table rt_comp_process_request (
    id nvarchar(36) primary key not null,
    version int default 0 not null,
    user_id nvarchar(64) not null,
    submitted_time bigint not null,
    application_id nvarchar(36) not null,
    environment_id nvarchar(36) not null,
    property_context_id nvarchar(36) not null,
    calendar_entry_id nvarchar(36) not null,
    approval_id nvarchar(36),
    component_id nvarchar(36) not null,
    component_process_id nvarchar(36) not null,
    component_process_version bigint not null,
    version_id nvarchar(36),
    resource_id nvarchar(36) not null,
    agent_id nvarchar(36) not null,
    trace_id nvarchar(36),
    parent_request_id nvarchar(36),
    continuation nvarchar(73),
    result nvarchar(32)
);

create table rt_stack_execution_record (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    resource_data ntext,
    last_updated bigint not null,
    result nvarchar(32),
    app_process_request_id nvarchar(36) not null,
    continuation nvarchar(73) not null,
    stack_id nvarchar(36) not null,
    provider_id nvarchar(36) not null
);

create table rt_deletable_trace (
    id nvarchar(36) not null primary key
);

--**************************************************************************************************
-- Manual Tasks
--**************************************************************************************************

create table tsk_approval (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    started_by_user_id nvarchar(64) not null,
    prop_sheet_id nvarchar(36) not null,
    failed nvarchar(1) not null,
    failed_by_user nvarchar(64),
    failed_comment nvarchar(4000),
    date_failed bigint
);

create table tsk_task (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    classname nvarchar(255) not null,
    name nvarchar(255) not null,
    comment_prompt nvarchar(1024),
    comment_required nvarchar(1),
    completed_by_user nvarchar(64),
    task_comment nvarchar(4000),
    date_started bigint,
    date_ended bigint,
    status nvarchar(64) not null,
    prop_sheet_id nvarchar(36) not null,
    prop_sheet_def_id nvarchar(36) not null
);

create table tsk_task_resource_role_map (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    task_id nvarchar(36) not null,
    sec_resource_role_id nvarchar(64),
    sec_resource_id nvarchar(64) not null,
    sec_role_id nvarchar(64) not null
);

create table tsk_task_member_map (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    task_id nvarchar(36) not null,
    sec_user_id nvarchar(64),
    sec_group_id nvarchar(64)
);

create table tsk_approval_to_task (
    approval_id nvarchar(36) not null,
    task_id nvarchar(36) not null
);



--**************************************************************************************************
-- Plugin System
--**************************************************************************************************

create table pl_plugin (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255),
    tag nvarchar(255),
    description nvarchar(4000),
    plugin_id nvarchar(255) not null,
    plugin_version int not null,
    ghosted_date bigint default 0 not null,
    plugin_hash nvarchar(255),
    release_version nvarchar(255)
);

create table pl_plugin_command (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255),
    sub_tag nvarchar(4000),
    description nvarchar(4000),
    plugin_id nvarchar(36) not null,
    type nvarchar(255),
    role_id nvarchar(36),
    prop_sheet_def_id nvarchar(36) not null
);

create table pl_command_to_resource_role (
    command_id nvarchar(36) not null,
    resource_role_id nvarchar(36) not null
);

create table pl_plugin_role (
    plugin_id nvarchar(36) not null,
    role_id nvarchar(36) not null
);

create table ds_plugin_task_request (
    workflow_id nvarchar(36) not null,
    activity_trace_id nvarchar(36) not null,
    activity_name nvarchar(255) not null,
    property_context_id nvarchar(36) not null,
    failure_continuation nvarchar(73) not null,
    success_continuation nvarchar(73) not null,
    dialogue_id nvarchar(36) not null primary key,
    version int default 0 not null,
    agent_id nvarchar(36),
    request_time bigint,
    last_resend_time bigint,
    resend_message varbinary(max),
    acked nvarchar(1) default 'N' not null
);

create table pl_source_config_plugin (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255),
    tag nvarchar(255),
    description nvarchar(4000),
    plugin_id nvarchar(255) not null,
    plugin_version int not null,
    ghosted_date bigint default 0 not null,
    plugin_hash nvarchar(255),
    release_version nvarchar(255),
    comp_prop_sheet_id nvarchar(36),
    import_prop_sheet_id nvarchar(36)
);

create table pl_source_config_execution (
    id nvarchar(36) not null primary key,
    task_info nvarchar(255),
    component_id nvarchar(36),
    agent_id nvarchar(36),
    start_time bigint,
    end_time bigint,
    status nvarchar(16),
    auth_token nvarchar(255),
    input_properties ntext,
    request_time bigint,
    acked nvarchar(1) default 'N' not null
);

--**************************************************************************************************
-- Licensing and agent data
--**************************************************************************************************

create table ds_agent_data (
    agent_data nvarchar(255) not null
);

create table ds_license_log_entry (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    message nvarchar(4000) not null,
    violation_time bigint not null,
    dismissed nvarchar(1) default 'N' not null
);



--**************************************************************************************************
-- Network data
--**************************************************************************************************

create table ds_network_relay (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    name nvarchar(255) not null,
    active nvarchar(1) not null,
    host nvarchar(255) not null,
    port int not null
);



--**************************************************************************************************
-- Reporting
--**************************************************************************************************

create table ds_recent_report (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    user_id nvarchar(64) not null,
    report_type nvarchar(255) not null,
    report_name nvarchar(255) not null,
    last_run bigint not null
);

create table rp_app_req_plugin (
    app_request_id nvarchar(255) not null,
    plugin_name nvarchar(255) not null
);

--**************************************************************************************************
-- Locking
--**************************************************************************************************

create table ds_ptr_store_lock(
    id int not null primary key
);

create table ds_lockable (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    lock_name nvarchar(4000) not null,
    max_permits int default 1 not null
);

create table ds_lock (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    acquirer nvarchar(36) not null,
    success_continuation nvarchar(73),
    failure_continuation nvarchar(73),
    acquired nvarchar(1) not null,
    lockable nvarchar(36) not null,
    date_created bigint default 0 not null
);

create table ds_comp_ver_int_rec (
   id nvarchar(36) not null primary key
);

create table ds_vfs_repo_rec (
   id nvarchar(36) not null primary key
);

create table ds_audit_entry (
   id nvarchar(36) not null primary key,
   version int default 0 not null,
   user_id nvarchar(64),
   user_name nvarchar(255),
   event_type nvarchar(255) not null,
   description nvarchar(255),
   obj_type nvarchar(255),
   obj_name nvarchar(255),
   obj_id nvarchar(255),
   created_date bigint not null,
   status nvarchar(255) not null,
   deletable nvarchar(1) default 'Y',
   ip_address nvarchar(40)
);

create table ds_request_audit_entry (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    user_id nvarchar(36),
    short_url nvarchar(255) not null,
    full_url nvarchar(4000) not null,
    duration bigint not null,
    method nvarchar(10) not null,
    date_created bigint not null
);

create table ds_sync (
    name nvarchar(255) not null primary key,
    locked nvarchar(1) not null,
    value nvarchar(255)
);


--**************************************************************************************************
-- Integration
--**************************************************************************************************

create table ds_integration_provider (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    date_created bigint not null,
    classname nvarchar(255) not null,
    name nvarchar(255) not null,
    description nvarchar(4000),
    prop_sheet_id nvarchar(36) not null,
    ghosted_date bigint default 0 not null
);

create table ds_ext_environment (
    id nvarchar(36) not null primary key,
    ext_id nvarchar(36) not null,
    name nvarchar(255) not null,
    version int default 0 not null,
    environment_id nvarchar(36) not null,
    date_created bigint not null,
    ext_blueprint_id nvarchar(255),
    ext_blueprint_name nvarchar(255) not null,
    ext_blueprint_version nvarchar(36),
    ext_blueprint_url nvarchar(255),
    ext_configuration_id nvarchar(255),
    ext_configuration_name nvarchar(255),
    ext_configuration_version nvarchar(36),
    integration_provider_id nvarchar(36),
    prop_sheet_id nvarchar(36) not null,
    ghosted_date bigint default 0 not null
);

--**************************************************************************************************
-- History Cleanup
--**************************************************************************************************

create table ds_history_cleanup_record (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    total_deployments_for_cleanup int not null,
    deployments_deleted int default 0 not null,
    date_cleanup_started bigint not null,
    date_cleanup_finished bigint
);
