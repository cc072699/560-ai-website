module.exports = {
  apps: [{
    name: '560web',
    cwd: '/var/www/560web',
    script: 'node_modules/.bin/next',
    args: 'start -p 8091',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
    },
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/560web-error.log',
    out_file: '/var/log/560web-out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
};
