class DungeonScene extends Phaser.Scene {
    constructor() {
        super({ key: "DungeonScene" });
    }

    preload() {
        this.load.image('relik', 'assets/relik.png');
        this.load.image('monster', 'assets/monster.png');
        this.load.image('item', 'assets/item.png'); // Tambahkan gambar item
    }

    create() {
        this.add.text(10, 10, "Dungeon - Tekan B untuk kembali ke Kota", { font: "16px Arial", fill: "#fff" });

        // Statistik Player
        this.playerStats = {
            level: 1,
            exp: 0,
            expToNextLevel: 50,
            hp: 100,
            power: 10
        };

        this.inventory = []; // Simpan item yang dikumpulkan

        this.expText = this.add.text(10, 40, `Level: ${this.playerStats.level} | HP: ${this.playerStats.hp}`, { font: "14px Arial", fill: "#fff" });

        // Player
        this.player = this.physics.add.sprite(400, 500, 'player');
        this.player.setCollideWorldBounds(true);

        // Relik
        this.relik = this.physics.add.sprite(400, 300, 'relik');

        // Monster AI
        this.monster = this.physics.add.sprite(400, 200, 'monster');
        this.monster.setCollideWorldBounds(true);
        this.monster.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));

        // Tambahkan overlap untuk serangan monster
        this.physics.add.overlap(this.player, this.monster, this.monsterAttack, null, this);

        // Tombol kembali ke Kota
        this.input.keyboard.on('keydown-B', () => {
            this.scene.start("TownScene");
        });
    }

    update() {
        let distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.monster.x, this.monster.y);
        if (distance < 100) {
            this.physics.moveToObject(this.monster, this.player, 60);
        }
    }

    attackMonster() {
        let expGain = Phaser.Math.Between(10, 20);
        this.playerStats.exp += expGain;
        this.expText.setText(`Level: ${this.playerStats.level} | HP: ${this.playerStats.hp}`);

        if (this.playerStats.exp >= this.playerStats.expToNextLevel) {
            this.levelUp();
        }

        this.dropItem(this.monster.x, this.monster.y);
        this.monster.destroy();
    }

    levelUp() {
        this.playerStats.level += 1;
        this.playerStats.exp = 0;
        this.playerStats.expToNextLevel += 50;
        this.playerStats.hp += 20;
        this.playerStats.power += 5;

        this.expText.setText(`Level: ${this.playerStats.level} | HP: ${this.playerStats.hp}`);
        this.add.text(350, 250, "Level Up!", { font: "20px Arial", fill: "#FFD700" });
    }

    monsterAttack(player, monster) {
        this.playerStats.hp -= 10;
        this.expText.setText(`Level: ${this.playerStats.level} | HP: ${this.playerStats.hp}`);

        if (this.playerStats.hp <= 0) {
            this.respawnPlayer();
        }
    }

    respawnPlayer() {
        this.player.setPosition(400, 500);
        this.playerStats.hp = 100;
        this.expText.setText(`Level: ${this.playerStats.level} | HP: ${this.playerStats.hp}`);
        this.add.text(350, 250, "Respawn!", { font: "20px Arial", fill: "#FF0000" });
    }

    dropItem(x, y) {
        let items = ["Pedang", "Armor", "Potion"];
        let rarity = ["Umum", "Langka", "Epik", "Legendaris"];
        let chosenItem = items[Phaser.Math.Between(0, items.length - 1)];
        let chosenRarity = rarity[Phaser.Math.Between(0, rarity.length - 1)];

        let itemSprite = this.physics.add.sprite(x, y, 'item');
        itemSprite.setInteractive();
        this.add.text(x - 20, y - 20, `${chosenItem} (${chosenRarity})`, { font: "12px Arial", fill: "#FFD700" });

        itemSprite.on('pointerdown', () => {
            this.inventory.push({ name: chosenItem, rarity: chosenRarity });
            itemSprite.destroy();
            console.log("Item diambil:", chosenItem, chosenRarity);
        });
    }
}

class DungeonScene extends Phaser.Scene {
    constructor() {
        super({ key: "DungeonScene" });
    }

    preload() {
        this.load.image('portal', 'assets/portal.png');
    }

    create() {
        this.add.text(10, 10, "Dungeon - Tekan B untuk kembali ke Kota", { font: "16px Arial", fill: "#fff" });

        // Player
        this.player = this.physics.add.sprite(400, 500, 'player');
        this.player.setCollideWorldBounds(true);

        // Portal
        this.portal = this.physics.add.sprite(400, 250, 'portal');
        this.portal.setInteractive();

        // Tambahkan overlap untuk transportasi
        this.physics.add.overlap(this.player, this.portal, this.enterPortal, null, this);
    }

    enterPortal() {
        let choice = confirm("Ke mana Anda ingin pergi?\n1. Kota\n2. Dungeon Lain\n3. Lokasi Rahasia");

        if (choice === true) {
            this.scene.start("TownScene"); // Teleport ke Kota
        } else {
            alert("Anda tetap di dungeon.");
        }
    }
}