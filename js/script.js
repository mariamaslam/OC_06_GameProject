// creating weapons for the gaming purpose
class Weapon {
    constructor(name, power) {
        this.name = name;
        this.power = power;
        this.x = 0;
        this.y = 0;
        this.beenEquipped = false;
    }
}
// creating new users for game
class User {
    constructor(username, name, has_moved, color) {
        this.username = username;
        this.name = name || 'User';
        this.health = 100;
        this.x = 0;
        this.y = 0;
        this.pname = 'Default';
        this.power = 10;
        this.has_moved = has_moved;
        this.color = color;
        this.isAttacking = true;
    }
}
// naming the game weapons
const weaponsArray = [
    new Weapon('bomb', 20),
    new Weapon('gun', 15),
    new Weapon('pistol', 18),
    new Weapon('knife', 17)
];
// naming users 
const usersArray = [
    new User('Mariam', 'user1', false, 'legal1'),
    new User('Ali', 'user2', true, 'legal2')
];

const P1 = usersArray[0];
const P2 = usersArray[1];


class Game {
    constructor() {
            //holds 18 unique numbers --- 0-11 -> Obstacles --- 11-15 -> Weapons --- 15-17 -> users
            this.unique_cordinates = [];
            this.obstaclesArray = [];
            this.legal_moves = [];
            this.current_player = P1;
            this.toggler = 0;
            this.round = 0;
            // get 100 array for grind items
            this.blocks;
        }
        //Populate 10x10 Grid
    grid_setup() {
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                $('.grid-container').append(
                    '<div class = "grid-item z-depth-1 waves-effect" data-x = ' + x + ' data-y = ' + y + '></div>'
                )
            }
        }
        console.log("Grid Setup");
    }
    getBlocks() {
            this.blocks = $('.grid-item').toArray();
        }
        //returns unique coordinates
    unique_array(count) {
        while (this.unique_cordinates.length < count) {
            var r = Math.floor(Math.random() * 100);

            var check = $.inArray(r, this.unique_cordinates);
            if (check === -1) {
                this.unique_cordinates.push(r);
            }
        }
    }

    //populate obstacles on board
    populate_obstacles() {

        for (let i = 0; i < 12; i++) {
            let obsX = Math.floor(this.unique_cordinates[i] / 10);
            let obsY = Math.floor(this.unique_cordinates[i] % 10);

            for (let k = 0; k < this.blocks.length; k++) {
                let statusX = parseInt(this.blocks[k].dataset.x) === obsX;
                let statusY = parseInt(this.blocks[k].dataset.y) === obsY;
                if (statusX && statusY) {
                    this.blocks[k].classList.add('disabled')
                }
            }
        }
    }

    //populate weapons and users
    populate_items(array, offset) {
        for (let i = 0; i < array.length; i++) {
            let obsX = Math.floor(this.unique_cordinates[i + offset] / 10);
            let obsY = Math.floor(this.unique_cordinates[i + offset] % 10);

            array[i].x = obsX;
            array[i].y = obsY;

            for (let k = 0; k < this.blocks.length; k++) {
                let statusX = parseInt(this.blocks[k].dataset.x) === obsX;
                let statusY = parseInt(this.blocks[k].dataset.y) === obsY;
                if (statusX && statusY) {
                    this.blocks[k].classList.add(array[i].name)
                }
            }
        }
    }

    //check if users are too close then seperate them.
    check_users() {
        if ((this.unique_cordinates[16] > 49) && (this.unique_cordinates[17]) > 49) {
            console.log(this.unique_cordinates[16])
            this.unique_cordinates[16] -= 48;
            var check = $.inArray(this.unique_cordinates[16], this.unique_cordinates);
            if (check > -1) {
                console.log(this.unique_cordinates[16] + " duplicate found")
                this.unique_cordinates[16] = (this.unique_cordinates[16] + 8) % 100;
            }
            console.log(" changed to -> " + this.unique_cordinates[16]);
        }
        if ((this.unique_cordinates[16] < 49) && (this.unique_cordinates[17]) < 49) {
            console.log(this.unique_cordinates[16])
            this.unique_cordinates[16] += 48;
            var check = $.inArray(this.unique_cordinates[16], this.unique_cordinates);
            if (check > -1) {
                console.log(this.unique_cordinates[16] + " duplicate found")
                this.unique_cordinates[16] = (this.unique_cordinates[16] + 7) % 100;
            }
            console.log(" changed to => " + this.unique_cordinates[16]);
        }
    }

    //update active player, power and health
    show_status() {
        $('#textP2').empty().append(`Health: ${P2.health} <br>Power: ${P2.pname} <br>Damage: ${P2.power} <br>Attack Mode: ${P2.isAttacking}`)
        $('#textP1').empty().append(`Health: ${P1.health} <br>Power: ${P1.pname} <br>Damage: ${P1.power} <br>Attack Mode: ${P1.isAttacking}`)

        if ((this.toggler % 2) === 1) {
            $('#nameP1').empty().append(`${P1.username} <i class="far fa-circle fa-1x inactive"></i> `)
            $('#nameP2').empty().append(`${P2.username} <i class="fas fa-circle fa-1x active"></i> `)
        }
        if ((this.toggler % 2) === 0) {
            $('#nameP1').empty().append(`${P1.username} <i class="fas fa-circle fa-1x active"></i> `)
            $('#nameP2').empty().append(`${P2.username} <i class="far fa-circle fa-1x inactive"></i> `)
        }

    }

    //show attack/defend buttons for respective players
    indicate_battle() {
        if (this.toggler % 2 == 0) {
            $('#textP21').empty()
            $('#textP11').empty().append(` ${P1.username} choose Attack or Defend.`);
            $('#p1btn').show();
            $('#p2btn').hide();
        } else {
            $('#textP11').empty()
            $('#textP21').empty().append(` ${P2.username} choose Attack or Defend.`);
            $('#p2btn').show();
            $('#p1btn').hide();

        }

    }

    //remove attack/defend buttons for respective players
    indicate_peace() {
        $('#textP11').empty();
        $('#textP21').empty();
        $('#p1btn').hide();
        $('#p2btn').hide();
    }

    //toggle user turn
    toggle_player() {
        if ((this.toggler % 2) === 0) {
            P1.has_moved = true;
            P2.has_moved = false;
            this.remove_legal_moves();
            this.current_player = P2;
            this.toggler += 1;
            this.show_status();
            this.check_legal_moves(this.current_player.x, this.current_player.y);
        } else if ((this.toggler % 2) === 1) {
            P2.has_moved = true;
            P1.has_moved = false;
            this.remove_legal_moves();
            this.current_player = P1;
            this.toggler += 1;
            this.show_status();
            this.check_legal_moves(this.current_player.x, this.current_player.y);
        }
    }

    //for current player's position check legal moves
    check_legal_moves(x, y) {
        let number = x * 10 + y;
        let temp_legal_moves = []
        let range = -3;
        let temp_num = number;
        this.legal_moves = [];
        //along x
        for (let i = 0; i < 7; i++) {
            temp_num += range + i;
            //checking num > zero and < 100 also rangle from x.1 -> x.10
            if (!(temp_num < 0) && !(temp_num > 100) && (temp_num < (x + 1) * 10) && (temp_num >= x * 10)) {
                temp_legal_moves.push(temp_num);
            }
            temp_num = number;

            temp_num += (range * 10) + (i * 10);
            if (!(temp_num < 0) && !(temp_num > 100)) {
                temp_legal_moves.push(temp_num);
            }
            temp_num = number;
        }

        this.obstaclesArray = this.unique_cordinates.slice(0, 12);
        console.log(temp_legal_moves)

        for (let i = 0; i < temp_legal_moves.length; i++) {
            if (this.obstaclesArray.indexOf(temp_legal_moves[i]) == -1) {
                this.legal_moves.push(temp_legal_moves[i])
            }
        }
        console.log(this.legal_moves)
            /*this.legal_moves = temp_legal_moves.filter(function (val) {
                return this.obstaclesArray.indexOf(val) == -1;
            });*/
            //console.log("False Legal Moves:" + legal_moves);

        this.remove_false_legal(number);
        this.show_legal_moves();
    }

    //removes legal moves when obstacles are present.
    remove_false_legal(number) {
        let xIterate = 1;
        let yIterate = 10;
        //removing right side
        if (this.obstaclesArray.includes(number + xIterate)) {
            if (this.legal_moves.indexOf(number + 2) > -1) {
                this.legal_moves.splice(this.legal_moves.indexOf(number + 2), 1)
                    //console.log("Removing-R: ",number+2)

            }
            if (this.legal_moves.indexOf(number + 3) > -1) {
                this.legal_moves.splice(this.legal_moves.indexOf(number + 3), 1)
                    //console.log("Removing-R: ",number+3 )
            }
        } else if (this.obstaclesArray.includes(number + xIterate + xIterate)) {
            if (this.legal_moves.indexOf(number + 3) > -1) {
                this.legal_moves.splice(this.legal_moves.indexOf(number + 3), 1)
                    //console.log("Removing-R: ",number+3 )
            }
        }
        //console.log("False Legal Removed from right: ",legal_moves)

        //removing from left side
        if (this.obstaclesArray.includes(number - xIterate)) {
            if (this.legal_moves.indexOf(number - 2) > -1) {
                this.legal_moves.splice(this.legal_moves.indexOf(number - 2), 1)
                    //console.log("Removing-L: ",number-3 )

            }
            if (this.legal_moves.indexOf(number - 3) > -1) {
                this.legal_moves.splice(this.legal_moves.indexOf(number - 3), 1)
                    //console.log("Removing-L: ",number-3 )

            }
        } else if (this.obstaclesArray.includes(number - xIterate - xIterate)) {
            if (this.legal_moves.indexOf(number - 3) > -1) {
                this.legal_moves.splice(this.legal_moves.indexOf(number - 3), 1)
                    //console.log("Removing-L: ",number-3 )

            }
        }
        //console.log("False Legal Removed from left: ",legal_moves)

        //removing from bottom side
        if (this.obstaclesArray.includes(number + yIterate)) {
            if (this.legal_moves.indexOf(number + 20) > -1) {
                this.legal_moves.splice(this.legal_moves.indexOf(number + 20), 1)
                    //console.log("Removing-B: ",number+20)
            }
            if (this.legal_moves.indexOf(number + 30) > -1) {
                this.legal_moves.splice(this.legal_moves.indexOf(number + 30), 1)
                    //console.log("Removing-B: ",number+30 )
            }

        } else if (this.obstaclesArray.includes(number + yIterate + yIterate)) {
            if (this.legal_moves.indexOf(number + 30) > -1) {
                this.legal_moves.splice(this.legal_moves.indexOf(number + 30), 1)
                    //console.log("Removing-B: ",number+30 )
            }
        }
        //console.log("False Legal Removed from bottom: ",legal_moves)

        //removing from top side
        if (this.obstaclesArray.includes(number - yIterate)) {
            if (this.legal_moves.indexOf(number - 20) > -1) {
                this.legal_moves.splice(this.legal_moves.indexOf(number - 20), 1)
                    //console.log("Removing-T: ",number-20)
            }
            if (this.legal_moves.indexOf(number - 30) > -1) {
                this.legal_moves.splice(this.legal_moves.indexOf(number - 30), 1)
                    //console.log("Removing-T: ",number-30 )
            }

        } else if (this.obstaclesArray.includes(number - yIterate - yIterate)) {
            if (this.legal_moves.indexOf(number - 30) > -1) {
                this.legal_moves.splice(this.legal_moves.indexOf(number - 30), 1)
                    //console.log("Removing-T: ",number-30 )
            }
        }
        //console.log("False Legal Removed from top: ",legal_moves)
    }

    //display legal moves on board for current player
    show_legal_moves() {
        for (let j = 0; j < this.legal_moves.length; j++) {
            this.blocks[this.legal_moves[j]].classList.add(this.current_player.color)

        }
    }

    //remove legal moves from board for current player
    remove_legal_moves() {
        for (let j = 0; j < this.legal_moves.length; j++) {
            this.blocks[this.legal_moves[j]].classList.remove(this.current_player.color)

        }
    }

    //move to a box that is included in legal moves array
    move_to_legal(moveFrom, moveTo) {

        if (this.legal_moves.includes(moveTo)) {
            this.blocks[moveFrom].classList.remove(this.current_player.name)

            this.current_player.x = Math.floor(moveTo / 10);
            this.current_player.y = Math.floor(moveTo % 10);
            console.log(this.current_player.username, "has moved to", this.current_player.x + "" + this.current_player.y);
            this.blocks[moveTo].classList.add(this.current_player.name)
            this.show_legal_moves();
            this.update_weapons();

            if (this.check_fight()) {
                this.indicate_battle();
            } else {
                this.toggle_player();
                this.indicate_peace();
            }

        } else {
            console.log("Invalid Move Try Again.")
        }
    }




    //see if the user is on the box with weapon
    update_weapons() {
        let bomb = weaponsArray[0];
        let gun = weaponsArray[1];
        let pistol = weaponsArray[2];
        let knife = weaponsArray[3];


        if (this.current_player.x == bomb.x && this.current_player.y == bomb.y && !bomb.beenEquipped) {
            let old_power = this.current_player.pname;
            this.current_player.power = bomb.power;
            this.current_player.pname = bomb.name;
            bomb.beenEquipped = true;
            weaponsArray[0] = bomb;
            this.pickNdrop(old_power, bomb.name);
        } else if (this.current_player.x == gun.x && this.current_player.y == gun.y && !gun.beenEquipped) {
            let old_power = this.current_player.pname;
            this.current_player.power = gun.power;
            this.current_player.pname = gun.name;
            gun.beenEquipped = true;
            weaponsArray[1] = gun;
            this.pickNdrop(old_power, gun.name);
        } else if (this.current_player.x == pistol.x && this.current_player.y == pistol.y && !pistol.beenEquipped) {
            let old_power = this.current_player.pname;
            this.current_player.power = pistol.power;
            this.current_player.pname = pistol.name;
            pistol.beenEquipped = true;
            weaponsArray[2] = pistol; 
            this.pickNdrop(old_power, pistol.name);
        } else if (this.current_player.x == knife.x && this.current_player.y == knife.y && !knife.beenEquipped) {
            let old_power = this.current_player.pname;
            this.current_player.power = knife.power;
            this.current_player.pname = knife.name;
            knife.beenEquipped = true;
            weaponsArray[3] = knife;
            this.pickNdrop(old_power, knife.name);
        }

        this.show_status();
    }

    //swap powers
    pickNdrop(old_power, new_power) {
        console.log(this.current_player.username, ": ", old_power, "->", new_power);
        if (old_power == 'Default') {
            this.blocks[this.current_player.x * 10 + this.current_player.y].classList.remove(new_power);
            console.log(new_power, "taken from", this.current_player.x * 10 + this.current_player.y);
        } else {
            let old_index = weaponsArray.findIndex(x => x.name == old_power);
            console.log("index of old weapon", old_index)
            weaponsArray[old_index].beenEquipped = false;

            weaponsArray[old_index].x = this.current_player.x;
            weaponsArray[old_index].y = this.current_player.y;

            this.blocks[this.current_player.x * 10 + this.current_player.y].classList.remove(new_power);
            this.blocks[this.current_player.x * 10 + this.current_player.y].classList.add(old_power);

            console.log(old_power, "droped on", this.current_player.x * 10 + this.current_player.y);
            console.log(new_power, "taken from", this.current_player.x * 10 + this.current_player.y);
        }
    }

    //see if two players are in adjacent blocks 
    check_fight() {
        let range = -1;
        let other_player;
        (this.toggler % 2 == 0) ? other_player = P2: other_player = P1;
        let current_location = this.current_player.x * 10 + this.current_player.y;
        let temp_location = current_location;
        let inactive_location = other_player.x * 10 + other_player.y;

        console.log("Checking Fight");
        console.log("Active User:", this.current_player.username, this.current_player.x + "" + this.current_player.y);
        console.log("Inactive User:", other_player.username, other_player.x + "" + other_player.y);

        for (let i = 0; i < 3; i++) {
            temp_location += range + i;
            if (temp_location == inactive_location) {
                console.log("Enemy Spotted on Horizontal Axis")
                console.log(this.current_player.username, "can initiate attack.");
                return true
            }
            temp_location = current_location;

            temp_location += range * 10 + i * 10;
            if (temp_location == inactive_location) {
                console.log("Enemy Spotted on Vertical Axis")
                console.log(this.current_player.username, "can initiate attack.");
                return true;
            }
            temp_location = current_location;
        }
        return false;
    }

    //check defend/attack status and deduct health points from each player 
    commence_round() {
        if (P1.isAttacking && P2.isAttacking) {
            console.log(P1.username, "Attacking");
            console.log(P2.username, "Attacking");
            P1.health - P2.power <= 0 ? P1.health = 0 : P1.health -= P2.power;
            P2.health - P1.power <= 0 ? P2.health = 0 : P2.health -= P1.power;
        }
        if (P1.isAttacking && !P2.isAttacking) {
            console.log(P1.username, "Attacking");
            console.log(P2.username, "Defending");
            P2.health - parseInt(P1.power / 2) <= 0 ? P2.health = 0 : P2.health -= parseInt(P1.power / 2);

        }
        if (!P1.isAttacking && P2.isAttacking) {
            console.log(P1.username, "Defending");
            console.log(P2.username, "Attacking");
            P1.health - parseInt(P2.power / 2) <= 0 ? P1.health = 0 : P1.health -= parseInt(P2.power / 2);
        }
        if (!P1.isAttacking && !P2.isAttacking) {
            console.log(P1.username, "Defending");
            console.log(P2.username, "Defending");
        }
        this.show_status();
        this.show_legal_moves();
        this.check_victory();
    }

    //checkif any player has his health zero
    check_victory() {
        if (P1.health <= 0) {
            console.log(P2.username, "WON!!");
            console.log(P1.username, "LOST!")
            $('#success').append(
                `<div id="alert" class="alert alert-success" role="alert">
            ${P2.username} WON!!! New Game Starts in 5s
            </div>`
            );
            setTimeout(function() { Game.restart(); }, 5000);
        } else if (P2.health <= 0) {
            console.log(P1.username, "WON!!");
            console.log(P2.username, "LOST!")
            $('#success').append(
                `<div id="alert"  class="text-center mx-auto align-content-justify alert alert-success" role="alert">
            ${P1.username} WON!!! New Game Starts in 5s
            </div>`
            );
            setTimeout(function() { Game.restart(); }, 5000);
        }
    }

    //restart the game
    static restart() {
        location.reload();
    }

}

const game = new Game();
//populate  grid
game.grid_setup();
game.getBlocks();
game.unique_array(18);
game.populate_obstacles();
game.check_users();
game.populate_items(weaponsArray, 12);
game.populate_items(usersArray, 16)
game.show_status();
game.indicate_peace();

$('.grid-item').click(function() {
    clickedX = parseInt($(this)[0].attributes[1].value);
    clickedY = parseInt($(this)[0].attributes[2].value);
    console.log("Square clicked: " + clickedX + clickedY);
    let moveTo = clickedX * 10 + clickedY;
    let moveFrom = game.current_player.x * 10 + game.current_player.y;
    game.move_to_legal(moveFrom, moveTo)

})

$('#start').one("click", function() {
    game.check_legal_moves(P1.x, P1.y);
    $('#stop').show();
    $('#start').hide();

})
$('#stop').one("click", function() {
    Game.restart();
    $('#stop').hide();
})

$('#p1f').click(function() {
    P1.isAttacking = true;
    console.log(P1.username + " is attacking ? ", P1.isAttacking);
    game.toggle_player();
    game.remove_legal_moves();
    game.indicate_battle();
    game.show_status();
    game.round += 1;
    game.round % 2 == 0 ? game.commence_round() : console.log("");
})

$('#p1d').click(function() {
    P1.isAttacking = false;
    console.log(P1.username + " is attacking ? ", P1.isAttacking);
    game.toggle_player();
    game.remove_legal_moves();
    game.indicate_battle();
    game.show_status();
    game.round += 1;
    game.round % 2 == 0 ? game.commence_round() : console.log("");

})

$('#p2f').click(function() {
    P2.isAttacking = true;
    console.log(P2.username + " is attacking ? ", P2.isAttacking);
    game.toggle_player();
    game.remove_legal_moves();
    game.indicate_battle();
    game.show_status();
    game.round += 1;
    game.round % 2 == 0 ? game.commence_round() : console.log("");

})

$('#p2d').click(function() {
    P2.isAttacking = false;
    console.log(P2.username + " is attacking ? ", P2.isAttacking);
    game.toggle_player();
    game.remove_legal_moves();
    game.indicate_battle();
    game.show_status();
    game.round += 1;
    game.round % 2 == 0 ? game.commence_round() : console.log("");

})
$(document).ready(function() {
    $('#stop').hide();
})