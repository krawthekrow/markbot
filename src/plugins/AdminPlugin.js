const { exec } = require ('child_process');

class AdminPlugin {
    constructor(env){
        this.env = env;
        this.client = this.env.client;
        this.cmds = {
            'die': (returnChannel, argstring, msgInfo) => {
                this.env.dispose();
                this.client.disconnect('*BOOM*');
            },
            'join': (returnChannel, argstring, msgInfo) => {
                this.client.join(argstring);
            },
            'part': (returnChannel, argstring, msgInfo) => {
                const [channel, partMsg] = this.env.extractCmd(argstring);
                this.client.part(channel, partMsg);
            },
            'eval': (returnChannel, argstring, msgInfo) => {
                let evalRes = null;
                try{
                    evalRes = eval(argstring);
                }
                catch(e){
                    this.env.sendHighlight(
                        returnChannel, msgInfo.sender,
                        e.message
                    );
                    return;
                }
                this.env.sendHighlight(returnChannel, msgInfo.sender, evalRes.toString());
            },
            'exec': (returnChannel, argstring, msgInfo) => {
                exec(argstring, (err, stdout, stderr) => {
                    if(err){
                        console.log(err);
                        return;
                    }
                    this.env.sendHighlight(
                        returnChannel, msgInfo.sender, stdout);
                    if(stderr != ''){
                        this.env.sendHighlight(
                            returnChannel, msgInfo.sender, stderr);
                    }
                });
            },
            'say': (returnChannel, argstring, msgInfo) => {
                let [channel, message] = this.env.extractCmd(argstring);
                if(channel == '~') channel = returnChannel;
                this.env.sendMessage(channel, message);
            },
            'raw': (returnChannel, argstring, msgInfo) => {
                this.client.send(...argstring.split(' '));
            },
            'highlight': (returnChannel, argstring, msgInfo) => {
                if(!msgInfo.inQuery){
                    const re = new RegExp(argstring);
                    this.env.sendMessage(returnChannel,
                        Object.keys(this.client.chans[returnChannel].users)
                        .filter(nick => re.test(nick))
                        .map(nick => nick + ': ').join('')
                    );
                }
            }
        };
    }
    handleCommand(cmd, argstring, returnChannel, msgInfo){
        if(this.env.permissions.isAdmin(msgInfo.sender)){
            if(cmd in this.cmds){
                this.cmds[cmd](returnChannel, argstring, msgInfo);
            }
        }
        else{
            if(cmd == 'die' && !msgInfo.inQuery){
                this.client.send('kick', returnChannel, msgInfo.sender.nick, 'YOU die!');
            }
            else if(cmd == 'highlight'){
                this.env.sendMessage(returnChannel,
                    new Array(40).fill(msgInfo.sender.nick + ': ')
                    .join('')
                );
            }
        }
    }
};

module.exports = AdminPlugin;
