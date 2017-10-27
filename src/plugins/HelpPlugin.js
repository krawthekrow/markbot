class HelpPlugin {
    constructor(env){
        this.env = env;
        this.client = this.env.client;
        this.cmds = {
            'help': (returnChannel, argstring, msgInfo) => {
                this.env.sendHighlight(
                    returnChannel, msgInfo.sender, this.getHelp(argstring)
                );
            },
            'list': (returnChannel, argstring, msgInfo) => {
                this.env.sendHighlight(
                    returnChannel, msgInfo.sender, this.getHelp(argstring)
                );
            }
        };
    }
    getHelp(query){
        if(query == ''){
            return Object.keys(HelpPlugin.HELP_CONTENT).join(', ');
        }
        for(const category in HelpPlugin.HELP_CONTENT){
            for(const cmd in HelpPlugin.HELP_CONTENT[category]){
                if(query == cmd){
                    return HelpPlugin.HELP_CONTENT[category][cmd];
                }
            }
        }
        for(const category in HelpPlugin.HELP_CONTENT){
            if(query == category){
                return Object.keys(
                    HelpPlugin.HELP_CONTENT[category]
                ).join(', ');
            }
        }
        return 'Command not found!';
    }
    handleCommand(cmd, argstring, returnChannel, msgInfo){
        if(cmd in this.cmds){
            this.cmds[cmd](returnChannel, argstring, msgInfo);
        }
    }
};

HelpPlugin.HELP_CONTENT = {
    'general': {
        'ping': 'ping -- Check if SpinDown wants to talk to you.',
        'echo': 'echo <string> -- Echo. What did you think this was?',
        'observe': 'observe -- Observe an electron. What state will it be?',
        'addobs': 'addobs <observation> -- Add an observation. Change the laws of physics!',
        'getobs': 'getobs <id> -- See the observation with index id.',
        'shrug': 'shrug -- ' + String.raw`¯\_(ツ)_/¯`,
        'supershrug': 'supershrug -- ' + String.raw`¯\_(ツ)_/¯ ¯\_(ツ)_/¯ ¯\_(ツ)_/¯ ¯\_(ツ)_/¯`,
        'explode': 'explode <thing> -- Explodes a thing.',
        'poke': 'poke <nick> -- Poke someone.'
    },
    'admin': {
        'die': 'die -- Kill SpinDown. Once and for all.',
        'join': 'join <channel> -- Join a channel.',
        'part': 'part <channel> <message> -- Part a channel with a message.',
        'eval': 'eval <script> -- Summon the power of Javascript.',
        'say': 'say <channel> <message> -- Say a message in another channel.',
        'raw': 'raw <message> -- Send a raw message.',
        'highlight': 'highlight <regex> -- Annoy everyone matching a regex.',
        'mode': 'mode [<nick>] <mode changes> -- Change someone\'s modes for this channel, or the channel\'s modes if <nick> is omitted.',
        'op': 'op [<nick>] -- Make someone op. If <nick> is omitted, make yourself op.',
        'deop': 'deop [<nick>] -- Make someone not op. If <nick> is omitted, make yourself not op.'
    },
    'reload': {
        'reload': 'reload -- Reload all modules.'
    },
    'help': {
        'help': 'help <query> -- Ask SpinDown for help because you\'re too lazy to figure things out yourself.',
        'list': 'list <query> -- List commands in a category, or print the help string for a command. Definitely not the same thing as help.'
    }
};

module.exports = HelpPlugin;
