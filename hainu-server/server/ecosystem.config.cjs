module.exports = {
  apps: [{
    name: 'hainu-api',
    script: 'dist/app.js',
    cwd: '/var/www/hainu-workshop/server',
    instances: 1,
    autorestart: true,
    max_restarts: 10,
    restart_delay: 3000,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
    },
    error_file: '/var/log/hainu/api-error.log',
    out_file: '/var/log/hainu/api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }],
};
