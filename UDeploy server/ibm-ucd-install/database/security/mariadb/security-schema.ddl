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
    release_name varchar(36) binary not null,
    ver integer default 0 not null
) engine = innodb;

insert into sec_db_version (release_name, ver) values ('1.0', 31);

-- ============================================================================
--  security tables
-- ============================================================================

create table sec_action (
    id varchar(36) binary not null,
    version integer default 0 not null,
    name varchar(64) binary not null,
    description varchar(1024) binary,
    enabled varchar(1) binary default 'y' not null,
    cascading varchar(1) binary default 'n' not null,
    sec_resource_type_id varchar(36) binary not null,
    category varchar(64) binary,
    primary key (id)
) engine = innodb;

create table sec_auth_token (
    id varchar(36) binary not null,
    version integer default 0 not null,
    sec_user_id varchar(36) binary not null,
    token varchar(255) binary not null,
    expiration bigint not null,
    description varchar(1024) binary,
    os_user varchar(255) binary,
    host varchar(255) binary,
    date_created bigint default 0 not null,
    primary key (id)
) engine = innodb;

create table sec_authentication_realm (
    id varchar(36) binary not null,
    version integer default 0 not null,
    name varchar(64) binary not null,
    description varchar(1024) binary,
    sort_order integer not null,
    enabled varchar(1) binary default 'n' not null,
    read_only varchar(1) binary default 'n' not null,
    login_module varchar(1024) binary not null,
    ghosted_date bigint default 0 not null,
    allowed_attempts integer default 0 not null,
    primary key (id)
) engine = innodb;

create table sec_authentication_realm_prop (
    sec_authentication_realm_id varchar(36) binary not null,
    name varchar(1024) binary not null,
    value varchar(4000) binary
) engine = innodb;

create table sec_authorization_realm (
    id varchar(36) binary not null,
    version integer default 0 not null,
    name varchar(64) binary not null,
    description varchar(1024) binary,
    authorization_module varchar(1024) binary not null,
    ghosted_date bigint default 0 not null,
    primary key (id)
) engine = innodb;

create table sec_authorization_realm_prop (
    sec_authorization_realm_id varchar(36) binary not null,
    name varchar(1024) binary not null,
    value varchar(4000) binary
) engine = innodb;

create table sec_group (
    id varchar(36) binary not null,
    version integer default 0 not null,
    name varchar(255) binary not null,
    sec_authorization_realm_id varchar(36) binary not null,
    enabled varchar(1) binary default 'y' not null,
    primary key (id)
) engine = innodb;

create table sec_group_mapper (
    id varchar(36) binary not null,
    version integer default 0 not null,
    name varchar(64) binary not null unique,
    primary key (id)
) engine = innodb;

create table sec_group_mapping (
    id varchar(36) binary not null,
    version integer default 0 not null,
    sec_group_mapper_id varchar(36) binary not null,
    regex varchar(255) binary not null,
    replacement varchar(255) binary not null,
    primary key (id)
) engine = innodb;

create table sec_group_role_on_team (
    id varchar(36) binary not null,
    version integer default 0 not null,
    sec_group_id varchar(36) binary not null,
    sec_role_id varchar(36) binary not null,
    sec_team_space_id varchar(36) binary not null,
    primary key (id)
) engine = innodb;

create table sec_internal_user (
    id varchar(36) binary not null,
    version integer default 0 not null,
    name varchar(64) binary not null,
    password varchar(128) binary not null,
    encoded smallint default 0 not null,
    primary key (id)
) engine = innodb;

create table sec_realm_mapping (
    authentication_realm_id varchar(36) binary not null,
    authorization_realm_id varchar(36) binary not null
) engine = innodb;

create table sec_resource (
    id varchar(36) binary not null,
    version integer default 0 not null,
    name varchar(255) binary not null,
    enabled varchar(1) binary default 'y' not null,
    sec_resource_type_id varchar(36) binary not null,
    primary key (id)
) engine = innodb;

create table sec_resource_for_team (
    id varchar(36) binary not null,
    version integer default 0 not null,
    sec_resource_id varchar(36) binary not null,
    sec_team_space_id varchar(36) binary not null,
    sec_resource_role_id varchar(36) binary,
    primary key (id)
) engine = innodb;

create table sec_resource_hierarchy (
    parent_sec_resource_id varchar(36) binary not null,
    child_sec_resource_id varchar(36) binary not null,
    path_length integer not null,
    primary key (parent_sec_resource_id, child_sec_resource_id)
) engine = innodb;

create table sec_resource_role (
    id varchar(36) binary not null,
    version integer default 0 not null,
    name varchar(255) binary not null,
    description varchar(1024) binary,
    enabled varchar(1) binary default 'y' not null,
    sec_resource_type_id varchar(36) binary not null,
    primary key (id)
) engine = innodb;

create table sec_resource_type (
    id varchar(36) binary not null,
    version integer default 0 not null,
    name varchar(255) binary not null,
    enabled varchar(1) binary default 'y' not null,
    primary key (id)
) engine = innodb;

create table sec_role (
    id varchar(36) binary not null,
    version integer default 0 not null,
    name varchar(255) binary not null,
    description varchar(1024) binary,
    enabled varchar(1) binary default 'y' not null,
    ghosted_date bigint default 0 not null,
    primary key (id)
) engine = innodb;

create table sec_role_action (
    id varchar(36) binary not null,
    version integer default 0 not null,
    sec_role_id varchar(36) binary not null,
    sec_action_id varchar(36) binary not null,
    sec_resource_role_id varchar(36) binary,
    primary key (id)
) engine = innodb;

create table sec_team_space (
    id varchar(36) binary not null,
    version integer default 0 not null,
    enabled varchar(1) binary default 'y' not null,
    name varchar(255) binary not null,
    description varchar(4000) binary,
    primary key (id)
) engine = innodb;

create table sec_user (
    id varchar(36) binary not null,
    version integer default 0 not null,
    name varchar(255) binary not null,
    enabled varchar(1) binary default 'y' not null,
    password varchar(255) binary,
    actual_name varchar(255) binary,
    email varchar(255) binary,
    im_id varchar(255) binary,
    sec_authentication_realm_id varchar(36) binary not null,
    ghosted_date bigint default 0 not null,
    failed_attempts integer default 0 not null,
    sec_license_type_id_requested varchar(36) binary,
    sec_license_type_id_received varchar(36) binary,
    licensed_session_count integer default 0 not null,
    last_ip_address varchar(40) binary,
    phone_number varchar(20) binary,
    primary key (id)
) engine = innodb;

create table sec_user_property (
    id varchar(36) binary not null,
    version integer default 0 not null,
    name varchar(255) binary not null,
    value varchar(4000) binary,
    sec_user_id varchar(36) binary not null,
    primary key (id)
) engine = innodb;

create table sec_user_role_on_team (
    id varchar(36) binary not null,
    version integer default 0 not null,
    sec_user_id varchar(36) binary not null,
    sec_role_id varchar(36) binary not null,
    sec_team_space_id varchar(36) binary not null,
    primary key (id)
) engine = innodb;

create table sec_user_to_group (
    sec_user_id varchar(36) binary not null,
    sec_group_id varchar(36) binary not null
) engine = innodb;

create table sec_license_type (
     id varchar(36) binary not null,
     version integer default 0 not null,
     feature varchar(36) binary not null,
     is_reservable varchar(1) binary default 'n' not null,
     primary key (id)) engine = innodb;

create table sec_action_to_license_type (
    action_id varchar(36) binary not null,
    license_type_id varchar(36) binary not null
) engine = innodb;
