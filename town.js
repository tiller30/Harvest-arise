class TownScene extends Phaser.Scene {
    constructor() {
        super({ key: "TownScene" });
    }

    preload() {
        this.load.image('inventory_button', 'assets/inventory_button.png');
    }

    create() {
        this.add.text(10, 10, "Kota - Tekan D untuk masuk Dungeon", { font: "16px Arial", fill: "#fff" });

        // Player
        this.player = this.physics.add.sprite(400, 500, 'player');
        this.player.setCollideWorldBounds(true);

        // Tombol Inventory
        this.inventoryButton = this.add.image(700, 50, 'inventory_button').setInteractive();
        this.inventoryButton.on('pointerdown', () => {
            this.openInventory();
        });

        // Inventory pemain
        this.inventory = [
            { name: "Potion", quantity: 2, effect: "restore_hp" },
            { name: "Pedang Relik", quantity: 1, effect: null }
        ];
    }

    openInventory() {
        let inventoryList = "Inventory:\n";
        this.inventory.forEach((item, index) => {
            inventoryList += `${index + 1}. ${item.name} (x${item.quantity})\n`;
        });

        let choice = prompt(`${inventoryList}\nPilih item untuk digunakan atau tekan B untuk keluar.`);

        if (choice && !isNaN(choice)) {
            let index = parseInt(choice) - 1;
            if (index >= 0 && index < this.inventory.length) {
                this.useItem(index);
            }
        }
    }

    useItem(index) {
        let item = this.inventory[index];

        if (item.effect === "restore_hp") {
            alert("Menggunakan Potion! HP bertambah.");
            this.inventory[index].quantity -= 1;

            if (this.inventory[index].quantity <= 0) {
                this.inventory.splice(index, 1);
            }
        } else {
            alert("Item ini tidak bisa digunakan sekarang.");
        }
    }
}