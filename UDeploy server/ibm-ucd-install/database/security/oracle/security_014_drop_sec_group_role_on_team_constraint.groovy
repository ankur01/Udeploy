/*
 * Licensed Materials - Property of IBM Corp.
 * IBM UrbanCode Build
 * IBM UrbanCode Deploy
 * IBM UrbanCode Release
 * IBM AnthillPro
 * (c) Copyright IBM Corporation 2002, 2014. All Rights Reserved.
 *
 * U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
 * GSA ADP Schedule Contract with IBM Corp.
 */
import groovy.sql.Sql;

import java.io.*;
import java.lang.*;
import java.sql.Connection;
import java.util.*;

// login information for database
// this should be modified as need be
Hashtable properties = (Hashtable) this.getBinding().getVariable("ANT_PROPERTIES");
Connection connection = (Connection) this.getBinding().getVariable("CONN");
boolean verbose = Boolean.valueOf(properties.get("verbose")).booleanValue();
Sql sql = new Sql(connection)
//------------------------------------------------------------------------------
//utility methods

error = { message ->
  println("!!"+message);
}

warn = { message ->
  println("warn - "+message);
}

debug = { message ->
  if (verbose) {
    println(message);
  }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
sql.connection.autoCommit = false;

String drop_group_role_on_team_constraint = "alter table sec_group_role_on_team drop constraint sgrot_sec_group_fk"

try {
    sql.execute(drop_group_role_on_team_constraint)
}
catch (Exception e) {
    warn(e);
}