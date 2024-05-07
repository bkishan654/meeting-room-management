const prop=require('./properties');

const mysql=require('mysql');
    
module.exports={
    getConnection:()=>{
        return mysql.createConnection(prop);
    }
}

