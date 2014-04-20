var config = {
  local: {
      mode: 'local',
      port: '3500', 
      mongo: {
        'hostname': 'ds053778.mongolab.com',
        'port': 53778,
        'username': 'amir',
        'password': 'abcdefg',
        'name': '',
        'db': 'heroku_app24333237'
      }
   },
  production: {
      mode: 'production',
      port: '5000', 
      mongo: {
        'hostname': 'amir-HP-Pavilion-dv5-Notebook-PC',
        'port': 27017,
        'username': '',
        'password': '',
        'name': '',
        'db': 'Users'
      }
   }
};
module.exports=function(mode) {
  return config[process.argv[2] || mode] || config.local; 
}


