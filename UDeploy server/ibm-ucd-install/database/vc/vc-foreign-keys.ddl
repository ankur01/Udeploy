-- Licensed Materials - Property of IBM Corp.
-- IBM UrbanCode Build
-- IBM UrbanCode Deploy
-- IBM UrbanCode Release
-- IBM AnthillPro
-- (c) Copyright IBM Corporation 2002, 2014. All Rights Reserved.
--
-- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
-- GSA ADP Schedule Contract with IBM Corp.
create index vc_commit_path_path on vc_commit_path_entry(path);
create index vc_commit_path_commit_id on vc_commit_path_entry(commit_id);
alter table vc_commit_path_entry add constraint vc_commit_path_to_commit foreign key (commit_id) references vc_commit (id);

create index vc_persistent_rec_path_ver on vc_persistent_record(path, relative_version);
create index vc_persistent_record_commit on vc_persistent_record(commit_id);
create index vc_persistent_record_version on vc_persistent_record(relative_version);
create index vc_persistent_record_directory on vc_persistent_record(directory);

create index vc_lve_persistent_record_id on vc_latest_version_entry(persistent_record_id);

create index vc_prm_gen_key on vc_persistent_record_metadata(metadata_generator, metadata_key);
create index vc_prm_key on vc_persistent_record_metadata(metadata_key);
create index vc_prm_value on vc_persistent_record_metadata(metadata_value);
create index vc_prm_record_id on vc_persistent_record_metadata(persistent_record_id);
create index vc_prm_record_commit on vc_persistent_record_metadata(persistent_record_commit);

