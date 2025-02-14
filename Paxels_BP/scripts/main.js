import { world } from '@minecraft/server';
const grass_paths = ["minecraft:grass_block", "minecraft:dirt"];
const logs = ["minecraft:oak_log", "minecraft:spruce_log", "minecraft:birch_log", "minecraft:jungle_log", "minecraft:acacia_log", "minecraft:dark_oak_log", "minecraft:crimson_stem", "minecraft:warped_stem", "minecraft:mangrove_log", "minecraft:cherry_log", "minecraft:pale_oak_log",
    "minecraft:oak_wood", "minecraft:spruce_wood", "minecraft:birch_wood", "minecraft:jungle_wood", "minecraft:acacia_wood", "minecraft:dark_oak_wood", "minecraft:crimson_hyphae", "minecraft:warped_hyphae", "minecraft:mangrove_wood", "minecraft:cherry_wood", "minecraft:pale_oak_wood", "minecraft:bamboo_block"];


world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("paxel:use", {
        onUseOn: ({ source, block }) => {
            const blockId = block.type.id;
            const { x, y, z } = block.location;
            if (grass_paths.includes(blockId)) {
                const blockAbove = world.getDimension('overworld').getBlock({ x, y: y + 1, z });
                if (!blockAbove || blockAbove.type.id === 'minecraft:air') {
                    source.runCommand(`setblock ${x} ${y} ${z} minecraft:grass_path`);
                    source.runCommand(`playsound use.grass @s ~ ~ ~ 0.8 0.8`);
                }
            }
            if (logs.includes(blockId)) {
                const blockState = block.permutation.getState("pillar_axis");
                source.runCommand(`setblock ${x} ${y} ${z} minecraft:stripped_${blockId.split(":")[1]}["pillar_axis"=${blockState}]`);
                source.runCommand(`playsound use.wood @s ~ ~ ~ 0.8 0.8`);
            }
        }
    });
});

world.beforeEvents.playerBreakBlock.subscribe(ev => {
    const itemId = ev.itemStack.type.id;

});