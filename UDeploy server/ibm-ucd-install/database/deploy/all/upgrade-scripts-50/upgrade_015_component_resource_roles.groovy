/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
import groovy.sql.Sql

def connection = this.binding['CONN'];
def sql = new Sql(connection)

def getAllComponents = '''
    select name
    from ds_component
    where ghosted_date = 0
'''

def createResourceRole = '''
    insert into ds_resource_role
    (id, version, name, description, color, prop_sheet_def_id)
    values
    (?, 0, ?, '', '#ffffff', ?)
'''

def createPropSheetDef = '''
    insert into ps_prop_sheet_def
    (id, version, name, description, prop_sheet_group_id, template_handle, template_prop_sheet_def_id)
    values
    (?, 0, ?, null, null, null, null)
'''

def getAllResourceRoles = '''
    select name
    from ds_resource_role
'''

def resourceRoleNames = []
sql.eachRow(getAllResourceRoles) { resourceRoleRow ->
    def name = resourceRoleRow['name']
    resourceRoleNames.add(name)
}

sql.eachRow(getAllComponents) { componentRow ->
    def name = componentRow['name']
    
    if (!resourceRoleNames.contains(name)) {
        def roleId = UUID.randomUUID().toString()
        def psdId = UUID.randomUUID().toString()
        
        sql.executeUpdate(createPropSheetDef, [psdId, name])
        sql.executeUpdate(createResourceRole, [roleId, name, psdId])
    }
}