import { system, world, GameMode } from "@minecraft/server";

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
    "minecraft:bamboo_block",
];

const blockSounds = {
    "minecraft:cherry_log": "step.cherry_wood",
    "minecraft:cherry_wood": "step.cherry_wood",
    "minecraft:bamboo_block": "step.bamboo_wood",
    "minecraft:crimson_stem": "use.stem",
    "minecraft:warped_stem": "use.stem",
    "minecraft:crimson_hyphae": "use.stem",
    "minecraft:warped_hyphae": "use.stem",
};

function isCreativeMode(player) {
    return player.getGameMode() == GameMode.Creative;
}

function decreaseDurability(player) {
    const inv = player.getComponent("inventory");
    const slot = inv.container.getSlot(player.selectedSlotIndex);
    const item = slot.getItem();

    if (!item?.hasTag("paxel:is_paxel")) return;

    const level = item
        .getComponent("minecraft:enchantable")
        ?.getEnchantment("unbreaking")?.level ?? 0;

    function durability() {
        const durability = item.getComponent("durability");
        const t = Math.floor(Math.random() * 100);

        if (t < durability.getDamageChance()) {
            if (durability.maxDurability - durability.damage <= 0) {
                player.playSound("random.break");
                slot.setItem();
            } else {
                durability.damage += 1;
                slot.setItem(item);
            }
        }
    }

    const chance = Math.random();
    if (chance < level / (level + 1)) return;
    durability();
}

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const player = ev.player;
    const blockId = ev.block.typeId;

    if (!ev.itemStack?.hasTag("paxel:is_paxel")) return;

    let actionPerformed = false;

    if (logs.includes(blockId)) {
        system.run(() => {
            player.playSound(blockSounds[blockId] ?? "use.wood");
        });
        actionPerformed = true;
    }

    if (actionPerformed && !isCreativeMode(player)) {
        system.run(() => {
            decreaseDurability(player);
        })
    }
});

world.afterEvents.playerBreakBlock.subscribe((ev) => {
    const player = ev.player;

    if (!isCreativeMode(player)) {
        decreaseDurability(player);
    }
});
