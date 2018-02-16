-- Licensed Materials - Property of IBM Corp.
-- IBM UrbanCode Build
-- IBM UrbanCode Deploy
-- IBM UrbanCode Release
-- IBM AnthillPro
-- (c) Copyright IBM Corporation 2002, 2014. All Rights Reserved.
--
-- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
-- GSA ADP Schedule Contract with IBM Corp.
create table inv_db_version (
    release_name nvarchar(36) not null,
    ver integer default 0 not null
);

create table inv_resource_inventory (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    resource_id nvarchar(36) not null,
    version_id nvarchar(36) not null,
    component_id nvarchar(36) not null,
    status nvarchar(255) not null,
    date_created bigint not null,
    deployment_request_id nvarchar(36) not null,
    ghosted_date bigint default 0 not null
);

create table inv_desired_inventory (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    environment_id nvarchar(36) not null,
    role_id nvarchar(36),
    version_id nvarchar(36) not null,
    component_id nvarchar(36) not null,
    status nvarchar(255) not null,
    date_created bigint not null,
    deployment_request_id nvarchar(36),
    ghosted_date bigint default 0 not null
);

create table inv_env_prop_inventory (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    environment_id nvarchar(36) not null,
    component_id nvarchar(36) not null,
    prop_version bigint not null,
    date_created bigint not null,
    deployment_request_id nvarchar(36) not null,
    ghosted_date bigint default 0 not null
);

create table inv_resource_config_inventory (
    id nvarchar(36) not null primary key,
    version int default 0 not null,
    resource_id nvarchar(36) not null,
    prop_sheet_path nvarchar(255) not null,
    prop_sheet_version int not null,
    date_created bigint not null,
    deployment_request_id nvarchar(36) not null,
    ghosted_date bigint default 0 not null
);