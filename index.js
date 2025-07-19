const COMMAND_NAME = 'help';
const PERMISSION_NAME = 'user.help';
const PLUGIN_OWNER_ID = 'plugin:help-command';

async function onLoad(bot, options) {
    const log = bot.sendLog;
    const Command = bot.api.Command;
    const settings = options.settings;

    class HelpCommand extends Command {
        constructor() {
            super({
                name: COMMAND_NAME,
                description: 'Показывает список доступных команд.',
                aliases: ['хелп', 'помощь', 'команды'],
                permissions: PERMISSION_NAME,
                owner: PLUGIN_OWNER_ID,
                cooldown: 10,
                allowedChatTypes: ['clan', 'private', 'chat'],
                args: []
            });
        }

        async handler(bot, typeChat, user) {
            for (const line of settings.commandList) {
                bot.api.sendMessage(typeChat, line, user.username);
            }
        }
    }

    try {
        await bot.api.registerPermissions([{
            name: PERMISSION_NAME,
            description: 'Доступ к команде help',
            owner: PLUGIN_OWNER_ID
        }]);

        await bot.api.addPermissionsToGroup('Member', [PERMISSION_NAME]);
        await bot.api.registerCommand(new HelpCommand());
        log(`[${PLUGIN_OWNER_ID}] Команда '${COMMAND_NAME}' успешно зарегистрирована.`);

    } catch (error) {
        log(`[${PLUGIN_OWNER_ID}] Ошибка при загрузке: ${error.message}`);
    }
}

async function onUnload({
    botId,
    prisma
}) {
    console.log(`[${PLUGIN_OWNER_ID}] Удаление ресурсов для бота ID: ${botId}`);
    try {
        await prisma.command.deleteMany({
            where: {
                botId,
                owner: PLUGIN_OWNER_ID
            }
        });
        await prisma.permission.deleteMany({
            where: {
                botId,
                owner: PLUGIN_OWNER_ID
            }
        });
        console.log(`[${PLUGIN_OWNER_ID}] Команды и права плагина удалены.`);
    } catch (error) {
        console.error(`[${PLUGIN_OWNER_ID}] Ошибка при очистке ресурсов:`, error);
    }
}

module.exports = {
    onLoad,
    onUnload,
};
