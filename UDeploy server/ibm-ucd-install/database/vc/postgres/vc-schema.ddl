-- Licensed Materials - Property of IBM Corp.
-- IBM UrbanCode Build
-- IBM UrbanCode Deploy
-- IBM UrbanCode Release
-- IBM AnthillPro
-- (c) Copyright IBM Corporation 2002, 2014. All Rights Reserved.
--
-- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
-- GSA ADP Schedule Contract with IBM Corp.
create table vc_db_version (
    release_name varchar(255) not null,
    ver integer default 0 not null
);

create table vc_commit (
    id bigint not null primary key,
    commit_time bigint not null,
    commit_user varchar(255),
    commit_comment varchar(1000)
);

create table vc_commit_path_entry (
    id varchar(36) not null primary key,
    commit_id bigint not null,
    path varchar(255),
    entry_type varchar(32)
);

create table vc_persistent_record (
    id varchar(36) not null primary key,
    path varchar(255) not null,
    commit_id bigint not null,
    relative_version numeric not null,
    directory varchar(255) not null,
    persistent_data oid not null,
    deleted varchar(1) not null
);
create rule drop_vc_persistent_data as on delete to vc_persistent_record do select lo_unlink(old.persistent_data);
create rule change_vc_persistent_data as on update to vc_persistent_record do select lo_unlink(old.persistent_data) where old.persistent_data <> new.persistent_data;

create table vc_latest_version_entry (
    path varchar(255) primary key not null,
    persistent_record_id varchar(36) not null
);

create table vc_commit_lock (
    name varchar(36) primary key not null
);

create table vc_persistent_record_metadata (
    id varchar(36) primary key not null,
    metadata_generator varchar(255) not null,
    metadata_key varchar(255) not null,
    metadata_value varchar(255) not null,
    persistent_record_id varchar(36) not null,
    persistent_record_commit bigint not null
);

create table vc_persistent_meta_gen_state (
    id varchar(36) primary key not null,
    metadata_generator varchar(255) not null,
    metadata_generator_version numeric not null,
    scan_end_commit bigint not null,
    newest_scanned_commit bigint not null,
    locked varchar(1) not null
);

create table vc_prop_update (
    id varchar(36) not null primary key,
    updated varchar(1) default 'N'
);

create table vc_update_tracking (
    update_name varchar(255) not null primary key,
    completed varchar(1) default 'N'
);
