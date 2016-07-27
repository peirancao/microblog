var Connection = require('ssh2');
var targz = require('tar.gz');

var compress = new targz().compress('dist', '/tmp/n2x.in-client-dist.tar.gz', function(err){
    if(err)
        console.log(err);

    console.log('The compression has ended!');
    deploy({
        host: 'n2x.in',
        port: 22,
        username: 'n2x',
        password: 'Pr891012'
    });
});

var c = new Connection();

function deploy(config) {
    c.on('ready', function() {
        console.log('Connection :: ready');
        c.sftp(function(err, sftp) {
            if (err) consloe.log(err)

            sftp.on('end', function() {
                console.log('sftp :: ended');
                c.exec('cd /home/n2x/wwwroot/n2x.in-client/ && rm -fr assets && rm -f index.html && tar -zxf n2x.in-client-dist.tar.gz && rm -f n2x.in-client-dist.tar.gz && sudo chown -R n2x:n2x dist && sudo chmod -R 744 dist && mv dist/* ./ && rm -fr dist', function(err, stream) {
                    if (err) consloe.log(err);
                    stream.on('data', function(data, extended) {
                      console.log((extended === 'stderr' ? 'STDERR: ' : 'STDOUT: ')
                                  + data);
                    });
                    stream.on('end', function() {
                      console.log('Stream :: EOF');
                    });
                    stream.on('close', function() {
                      console.log('Stream :: close');
                    });
                    stream.on('exit', function(code, signal) {
                      console.log('Stream :: exit :: code: ' + code + ', signal: ' + signal);
                      c.end();
                    });
                });
            });

            sftp.fastPut('/tmp/n2x.in-client-dist.tar.gz', '/home/n2x/wwwroot/n2x.in-client/n2x.in-client-dist.tar.gz', function(err) {
                if (err) console.log(err);
                sftp.end();
            });

        });
    });

    c.on('error', function(err) {
      console.log('Connection :: error :: ' + err);
    });
    c.on('end', function() {
      console.log('Connection :: end');
    });
    c.on('close', function(had_error) {
      console.log('Connection :: close');
    });

    c.connect({
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password
    });
};
