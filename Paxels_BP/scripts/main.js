import { world } from '@minecraft/server';

const grass_paths = [
    "minecraft:grass_block",
    "minecraft:podzol",
    "minecraft:mycelium",
    "minecraft:dirt",
    "minecraft:coarse_dirt",
    "minecraft:dirt_with_roots"
];
const logs = [
    "minecraft:oak_log",
    "minecraft:spruce_log",
    "minecraft:birch_log",
    "minecraft:jungle_log",
    "minecraft:acacia_log",
    "minecraft:dark_oak_log",
    "minecraft:crimson_stem",
    "minecraft:warped_stem",
    "minecraft:mangrove_log",
    "minecraft:cherry_log",
    "minecraft:pale_oak_log",
    "minecraft:oak_wood",
    "minecraft:spruce_wood",
    "minecraft:birch_wood",
    "minecraft:jungle_wood",
    "minecraft:acacia_wood",
    "minecraft:dark_oak_wood",
    "minecraft:crimson_hyphae",
    "minecraft:warped_hyphae",
    "minecraft:mangrove_wood",
    "minecraft:cherry_wood",
    "minecraft:pale_oak_wood",
    "minecraft:bamboo_block"
];

function isCreativeMode(player) {
    return player.matches({ gameMode: "creative" });
}

function decreaseDurability(player) {
    const inv = player.getComponent("inventory");
    const slot = inv.container.getSlot(player.selectedSlotIndex);
    const item = slot.getItem();

    if (!item?.hasTag("paxel:durability")) return;

    const durability = item.getComponent("durability");
    durability.damage += 1;

    if (durability.damage >= durability.maxDurability) {
        player.playSound("random.break");
        slot.setItem();
    } else {
        slot.setItem(item);
    }
}

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("paxel:use", {
        onUseOn: ({ source, block }) => {
            const blockId = block.type.id;
            const { x, y, z } = block.location;

            let actionPerformed = false;

            if (grass_paths.includes(blockId)) {
                const blockAbove = block.dimension.getBlock({ x, y: y + 1, z });
                if (!blockAbove || blockAbove.type.id === 'minecraft:air') {
                    source.runCommandAsync(`setblock ${x} ${y} ${z} minecraft:grass_path`);
                    source.runCommandAsync(`playsound use.grass @s`);
                    actionPerformed = true;
                }
            }
            if (logs.includes(blockId)) {
                const blockState = block.permutation.getState("pillar_axis");
                source.runCommandAsync(`setblock ${x} ${y} ${z} minecraft:stripped_${blockId.split(":")[1]} ["pillar_axis"="${blockState}"]`);
                source.runCommandAsync(`playsound use.wood @s`);
                actionPerformed = true;
            }

            if (actionPerformed && !isCreativeMode(source)) {
                decreaseDurability(source);
            }
        }
    });
});

world.afterEvents.playerBreakBlock.subscribe(ev => {
    if (!isCreativeMode(ev.player)) {
        decreaseDurability(ev.player);
    }
});