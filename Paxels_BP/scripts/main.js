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

    let level = item.getComponent("minecraft:enchantable")?.getEnchantment("unbreaking")?.level;

    function durability() {
        const durability = item.getComponent("durability");
        const t = Math.floor(Math.random() * 100);

        if (t < durability.getDamageChance()) {
            durability.damage += 1;
            if (durability.damage >= durability.maxDurability) {
                player.playSound("random.break");
                slot.setItem();
            } else {
                slot.setItem(item);
            }
        }
    }

    if (level > 0) {
        const chance = Math.random();
        if (chance < level / (level + 1)) return;
    }
    durability();
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

            if (blockId === "minecraft:snow_layer") {
                source.runCommandAsync(`loot spawn ${x} ${y} ${z} mine ${x} ${y} ${z} minecraft:iron_shovel`);
                source.runCommandAsync(`playsound hit.snow @s`);
                source.runCommandAsync(`setblock ${x} ${y} ${z} air`);
                actionPerformed = true;
            }

            if (blockId.includes("copper")) {
                function changeCopperState(fromState, toState = '', sound = 'scrape') {
                    if (blockId.includes(fromState)) {
                        const newBlockId = blockId.replace(fromState, toState);
                        source.runCommandAsync(`playsound ${sound} @s`);
                        return newBlockId;
                    }
                    return null;
                }

                function showEffectParticles() {
                    for (let i = 0; i < 15; i++) {
                        const offsetX = (Math.random() - 0.5) * 1.5 + 0.5;
                        const offsetY = Math.random() * 1.5;
                        const offsetZ = (Math.random() - 0.5) * 1.5 + 0.5;
                        source.runCommandAsync(`particle minecraft:wax_particle ${x + offsetX} ${y + offsetY} ${z + offsetZ}`);
                    }
                }

                let newBlockId = changeCopperState('waxed_', '', 'copper.wax.off') ||
                    changeCopperState('oxidized_', 'weathered_') ||
                    changeCopperState('weathered_', 'exposed_') ||
                    changeCopperState('exposed_', '');

                if (newBlockId) {
                    actionPerformed = true;
                    if (blockId === "minecraft:waxed_copper" || blockId === "minecraft:exposed_copper") {
                        source.runCommandAsync(`setblock ${x} ${y} ${z} copper_block`);
                    } else {
                        const blockStates = block.permutation.getAllStates();
                        const stateString = Object.entries(blockStates)
                            .map(([key, value]) => `"${key}"=${typeof value === 'string' ? `"${value}"` : value}`)
                            .join(',');
                        source.runCommandAsync(`setblock ${x} ${y} ${z} ${newBlockId} [${stateString}]`);
                    }
                    showEffectParticles();
                }
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

