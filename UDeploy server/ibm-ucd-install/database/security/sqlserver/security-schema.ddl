-- licensed materials - property of ibm corp.
-- ibm urbancode build
-- ibm urbancode deploy
-- ibm urbancode release
-- ibm anthillpro
-- (c) copyright ibm corporation 2002, 2014. all rights reserved.
--
-- u.s. government users restricted rights - use, duplication or disclosure restricted by
-- gsa adp schedule contract with ibm corp.
-- ============================================================================
--  versioning table
-- ============================================================================

create table sec_db_version (
    release_name nvarchar(36) not null,
    ver integer default 0 not null
);

insert into sec_db_version (release_name, ver) values ('1.0', 31);

-- ============================================================================
--  security tables
-- ============================================================================

create table sec_action (
    id nvarchar(36) not null,
    version integer default 0 not null,
    name nvarchar(64) not null,
    description nvarchar(1024),
    enabled nvarchar(1) default 'y' not null,
    cascading nvarchar(1) default 'n' not null,
    sec_resource_type_id nvarchar(36) not null,
    category nvarchar(64),
    primary key (id)
);

create table sec_auth_token (
    id nvarchar(36) not null,
    version integer default 0 not null,
    sec_user_id nvarchar(36) not null,
    token nvarchar(255) not null,
    expiration bigint not null,
    description nvarchar(1024),
    os_user nvarchar(255),
    host nvarchar(255),
    date_created bigint default 0 not null,
    primary key (id)
);

create table sec_authentication_realm (
    id nvarchar(36) not null,
    version integer default 0 not null,
    name nvarchar(64) not null,
    description nvarchar(1024),
    sort_order integer not null,
    enabled nvarchar(1) default 'n' not null,
    read_only nvarchar(1) default 'n' not null,
    login_module nvarchar(1024) not null,
    ghosted_date bigint default 0 not null,
    allowed_attempts integer default 0 not null,
    primary key (id)
);

create table sec_authentication_realm_prop (
    sec_authentication_realm_id nvarchar(36) not null,
    name nvarchar(1024) not null,
    value nvarchar(4000)
);

create table sec_authorization_realm (
    id nvarchar(36) not null,
    version integer default 0 not null,
    name nvarchar(64) not null,
    description nvarchar(1024),
    authorization_module nvarchar(1024) not null,
    ghosted_date bigint default 0 not null,
    primary key (id)
);

create table sec_authorization_realm_prop (
    sec_authorization_realm_id nvarchar(36) not null,
    name nvarchar(1024) not null,
    value nvarchar(4000)
);

create table sec_group (
    id nvarchar(36) not null,
    version integer default 0 not null,
    name nvarchar(255) not null,
    sec_authorization_realm_id nvarchar(36) not null,
    enabled nvarchar(1) default 'y' not null,
    primary key (id)
);

create table sec_group_mapper (
    id nvarchar(36) not null,
    version integer default 0 not null,
    name nvarchar(64) not null unique,
    primary key (id)
);

create table sec_group_mapping (
    id nvarchar(36) not null,
    version integer default 0 not null,
    sec_group_mapper_id nvarchar(36) not null,
    regex nvarchar(255) not null,
    replacement nvarchar(255) not null,
    primary key (id)
);

create table sec_group_role_on_team (
    id nvarchar(36) not null,
    version integer default 0 not null,
    sec_group_id nvarchar(36) not null,
    sec_role_id nvarchar(36) not null,
    sec_team_space_id nvarchar(36) not null,
    primary key (id)
);

create table sec_internal_user (
    id nvarchar(36) not null,
    version integer default 0 not null,
    name nvarchar(64) not null,
    password nvarchar(128) not null,
    encoded smallint default 0 not null,
    primary key (id)
);

create table sec_realm_mapping (
    authentication_realm_id nvarchar(36) not null,
    authorization_realm_id nvarchar(36) not null
);

create table sec_resource (
    id nvarchar(36) not null,
    version integer default 0 not null,
    name nvarchar(255) not null,
    enabled nvarchar(1) default 'y' not null,
    sec_resource_type_id nvarchar(36) not null,
    primary key (id)
);

create table sec_resource_for_team (
    id nvarchar(36) not null,
    version integer default 0 not null,
    sec_resource_id nvarchar(36) not null,
    sec_team_space_id nvarchar(36) not null,
    sec_resource_role_id nvarchar(36),
    primary key (id)
);

create table sec_resource_hierarchy (
    parent_sec_resource_id nvarchar(36) not null,
    child_sec_resource_id nvarchar(36) not null,
    path_length integer not null,
    primary key (parent_sec_resource_id, child_sec_resource_id)
);

create table sec_resource_role (
    id nvarchar(36) not null,
    version integer default 0 not null,
    name nvarchar(255) not null,
    description nvarchar(1024),
    enabled nvarchar(1) default 'y' not null,
    sec_resource_type_id nvarchar(36) not null,
    primary key (id)
);

create table sec_resource_type (
    id nvarchar(36) not null,
    version integer default 0 not null,
    name nvarchar(255) not null,
    enabled nvarchar(1) default 'y' not null,
    primary key (id)
);

create table sec_role (
    id nvarchar(36) not null,
    version integer default 0 not null,
    name nvarchar(255) not null,
    description nvarchar(1024),
    enabled nvarchar(1) default 'y' not null,
    ghosted_date bigint default 0 not null,
    primary key (id)
);

create table sec_role_action (
    id nvarchar(36) not null,
    version integer default 0 not null,
    sec_role_id nvarchar(36) not null,
    sec_action_id nvarchar(36) not null,
    sec_resource_role_id nvarchar(36),
    primary key (id)
);

create table sec_team_space (
    id nvarchar(36) not null,
    version integer default 0 not null,
    enabled nvarchar(1) default 'y' not null,
    name nvarchar(255) not null,
    description nvarchar(4000),
    primary key (id)
);

create table sec_user (
    id nvarchar(36) not null,
    version integer default 0 not null,
    name nvarchar(255) not null,
    enabled nvarchar(1) default 'y' not null,
    password nvarchar(255),
    actual_name nvarchar(255),
    email nvarchar(255),
    im_id nvarchar(255),
    sec_authentication_realm_id nvarchar(36) not null,
    ghosted_date bigint default 0 not null,
    failed_attempts integer default 0 not null,
    sec_license_type_id_requested nvarchar(36),
    sec_license_type_id_received nvarchar(36),
    licensed_session_count integer default 0 not null,
    last_ip_address nvarchar(40),
    phone_number nvarchar(20),
    primary key (id)
);

create table sec_user_property (
    id nvarchar(36) not null,
    version integer default 0 not null,
    name nvarchar(255) not null,
    value nvarchar(4000),
    sec_user_id nvarchar(36) not null,
    primary key (id)
);

create table sec_user_role_on_team (
    id nvarchar(36) not null,
    version integer default 0 not null,
    sec_user_id nvarchar(36) not null,
    sec_role_id nvarchar(36) not null,
    sec_team_space_id nvarchar(36) not null,
    primary key (id)
);

create table sec_user_to_group (
    sec_user_id nvarchar(36) not null,
    sec_group_id nvarchar(36) not null
);

create table sec_license_type (
     id nvarchar(36) not null,
     version integer default 0 not null,
     feature nvarchar(36) not null,
     is_reservable nvarchar(1) default 'n' not null,
     primary key (id));

create table sec_action_to_license_type (
    action_id nvarchar(36) not null,
    license_type_id nvarchar(36) not null
);
