function build_bracket(tourney_type, tourney_seeds, competitors, winners, losers) {
    'use strict';
    winners = (winners === undefined) ? {} : winners;
    losers = (losers === undefined) ? {} : losers;
    
    function bracket_connector(round, size, game1, game2) {
        size = (size === undefined) ? round : size;
        var height,
            width = 10,
            connector_html;
        if (round > 0) {
            height = ((29 + 5) * Math.pow(2, size));
            connector_html = '<svg height="' + height + '" width="' + width + '" style="position:absolute;left:' + (-width / 2) + 'px;top:' + ((-height / 2) + 29) + 'px" class="connect round-' + round + ' game-' + game1 + '"><line x1="' + (width / 2) + '" y1="' + (height / 2) + '" x2="' + width + '" y2="' + (height / 2) + '"/><line class="top" x1="' + (width / 2) + '" y1="0" x2="' + (width / 2) + '" y2="' + (height / 2) + '"/><line class="top" x1="0" y1="0" x2="' + (width / 2) + '" y2="0"/></svg>';
            connector_html += '<svg height="' + height + '" width="' + width + '" style="position:absolute;left:' + (-width / 2) + 'px;top:' + ((-height / 2) + 29) + 'px" class="connect round-' + round + ' game-' + game2 + '"><line x1="' + (width / 2) + '" y1="' + (height / 2) + '" x2="' + width + '" y2="' + (height / 2) + '"/><line class="bottom" x1="' + (width / 2) + '" y1="' + (height / 2) + '" x2="' + (width / 2) + '" y2="' + height + '"/><line class="bottom" x1="0" y1="' + height + '" x2="' + (width / 2) + '" y2="' + height + '"/></svg>';
        } else if (round === 0) {
            height = 30 + (29 * (size - 1));
            connector_html = '<svg height="' + height + '" width="' + width + '" style="position:absolute;left:' + (-width / 2) + 'px;top:0px" class="connect round-' + (round) + '"><line x1="0" y1="' + (height / 2) + '" x2="' + width + '" y2="' + (height / 2) + '"/></svg>';
        } else if (round === -1) {
            height = 15;
            connector_html = '<svg height="' + height + '" width="' + width + '" style="position:absolute;left:' + (-width / 2) + 'px;top:29px" class="connect round-' + (round) + ' game-' + game1 + '"><line x1="' + (width / 2) + '" y1="0" x2="' + (width / 2) + '" y2="' + height + '"/><line x1="' + (width / 2) + '" y1="' + height + '" x2="' + width + '" y2="' + height + '"/><line x1="0" y1="0" x2="' + (width / 2) + '" y2="0"/></svg>';
        }
        return connector_html;
    }
    
    function matchup_member(game_num, outcome, outcome_num) {
        var $matchup_member = $("<tr class='matchup-member loser-bracket-member'><td class='seed'></td><td class='name'></td><td class='advance-competitor'><button><span class='glyphicon glyphicon-arrow-right'></span></button></td></tr>"),
            result = (outcome === "winner") ? winners[outcome_num] : losers[outcome_num];
        $matchup_member.attr("data-" + outcome, outcome_num).attr("data-game", game_num);
        
        if (result) {
            $matchup_member.find(".seed").html(result.seed);
            $matchup_member.find(".name").html(result.name);
        }
        return $matchup_member;
    }
    
    function loser_bracket_html(byes, rounds, seed, slots, pos) {
        if (rounds > 0) {
            seed = (seed === undefined) ? 1 : seed;
            slots = (slots === undefined) ? [1] : slots;
            pos = (pos === undefined) ? 1 : pos;

            var $bracket = $("<table class='round-" + (rounds + 1) + "'><tr><td class='matchup'><div class='connect-wrap'></div></td><td class='winner round-" + (rounds + 1) + "'><div class='connect-wrap'></div></td></tr></table>"),
                $bracket2 = $bracket.clone(),
                $matchups = $("<table class='matchup-group'></table>"),
                $winner = $matchups.clone(),
                $bracket_header = $("<th></th>"),
                slot_count = slots.length * 2,
                seed_inv = slot_count + 1 - seed,
                seed_ref = slots[Math.abs((slots.length + 1) * (rounds % 2) - pos) - 1],
                new_slots = [],
                next_pos = 2,
                round_base = Math.pow(2, rounds + Math.log2(slot_count)),
                game_number = round_base * 2 - (slot_count * 2) + seed,
                dependent_base = (round_base * 2) - (slot_count * 2) - slot_count,
                loser_game = round_base - slot_count + seed_ref;

            $winner.append(matchup_member(game_number + (slot_count / 2), "loser", loser_game)).append(matchup_member(game_number + (slot_count / 2), "winner", game_number));

            if (rounds === 1) {
                if (slot_count === 2) {
                    $bracket.prepend($("<thead></thead>").append($("<tr class='bracket-header'></tr>").append("<th colspan='2'>Round 1</th>")));
                }
                if (seed_inv <= byes) {
                    $winner.addClass("bye");
                    $winner.find(".matchup-member").addClass("bye");
                }
                
                $matchups.append(matchup_member(game_number, "loser", round_base - slot_count * 2 + seed)).append(matchup_member(game_number, "loser", round_base - slot_count * 2 + seed_inv));
                if (seed <= byes) {
                    $matchups.addClass("bye");
                    $matchups.find(".matchup-member").addClass("bye");
                    $winner.append(matchup_member(game_number + (slot_count / 2), "loser", round_base - slot_count * 2 + seed_inv));
                    $winner.find("[data-winner='" + game_number + "']").remove();
                }
                $bracket.find(".winner").children(".connect-wrap").append($winner).append(bracket_connector(-1, 1, game_number));
                $bracket.find(".matchup").children(".connect-wrap").append($matchups);

                return $bracket;
            } else {
                rounds--;
                for (i = 0; i < slots.length; i++) {
                    if (slots[i] === 1) {
                        new_slots.push(1, slot_count);
                    } else {
                        new_slots.push(slot_count + 1 - slots[i], slots[i]);
                    }
                }
                if (pos !== 1) {
                    pos *= 2;
                    next_pos = pos - 1;
                }
                slots = new_slots;
                $matchups.append(matchup_member(game_number, "winner", dependent_base + seed)).append(matchup_member(game_number, "winner", dependent_base + seed_inv));
                $bracket.find(".winner").children(".connect-wrap").append($winner).append(bracket_connector(-1, 1, game_number));
                $bracket.find(".matchup").children(".connect-wrap").append($matchups).append(bracket_connector(rounds + 1, rounds, dependent_base + ((seed > 1) ? seed_inv : seed), dependent_base + ((seed > 1) ? seed : seed_inv)));
                if (slot_count === 2) {
                    for (i = 1; i < rounds + 1; i++) {
                        $bracket_header.append("<span class='round-" + (i + 1) + "'>Losers Round " + i + "</span>");
                    }
                    $bracket2.prepend($("<thead></thead>").append($("<tr class='bracket-header'></tr>").append($bracket_header).append("<th colspan='2' class='round-" + (rounds + 2) + "'>Losers Round " + (rounds + 1) + "</th>")));
                }
                $matchups = $bracket2.find(".matchup");
                $bracket2.find(".winner").addClass("round-" + (rounds + 2)).children(".connect-wrap").append($bracket);
                $matchups.append(loser_bracket_html(byes, rounds, seed, slots, pos)).append(loser_bracket_html(byes, rounds, seed_inv, slots, next_pos));
                return $bracket2;
            }
        }
    }
    
    function bracket_html(competitors, rounds, seed, slots, tourney_type) {
        seed = (seed === undefined) ? 1 : seed;
        slots = (slots === undefined) ? 1 : slots;

        var seed_inv = slots - seed + 1,
            round_base = Math.pow(2, rounds + Math.log2(slots)),
            game_number = round_base - slots + seed,
            dependent_base = round_base - (slots * 2),
            $placeholder = matchup_member(game_number, "winner", dependent_base + seed),
            $placeholder2 = matchup_member(game_number, "winner", dependent_base + seed_inv),
            $table = $("<table><tr><td class='matchup round-" + rounds + "'></td><td class='winner round-" + (rounds + 1) + "'><div class='connect-wrap'>" + bracket_connector(rounds, rounds, dependent_base + ((seed > 1) ? seed_inv : seed), dependent_base + ((seed > 1) ? seed : seed_inv)) + "</div></td></tr></table>"),
            $bracket,
            $bracket_header = $("<th></th>"),
            champion_header,
            $matchups = $("<div></div>"),
            round_text,
            round_diff,
            round_labels = ["Final", "Semifinal", "Quarterfinal"];

        if (slots === 2 && tourney_type == 1) {
            $placeholder.addClass("final");
            $placeholder2.addClass("final");
        }

        if (rounds  === 0) {
            $matchups = $("<table class='matchup-group'></table>");

            if (competitors[seed_inv - 1] === "Bye") {
                $matchups.addClass("bye");
                $matchups.append($placeholder.addClass("bye competitor").html("<td class='seed'>" + seed + "</td><td class='name'>" + competitors[seed - 1] + "</td><td class='advance-competitor'><button><span class='glyphicon glyphicon-arrow-right'></span></button></td>"));
                $matchups.append("<tr class='matchup-member bye'><td class='seed'>" + seed_inv + "</td><td class='name'>Bye</td></tr>");
            } else {
                $matchups.append($placeholder.addClass("competitor").html("<td class='seed'>" + seed + "</td><td class='name'>" + competitors[seed - 1] + "</td><td class='advance-competitor'><button><span class='glyphicon glyphicon-arrow-right'></span></button></td>"));
                $matchups.append($placeholder2.addClass("competitor").html("<td class='seed'>" + seed_inv + "</td><td class='name'>" + competitors[seed_inv - 1] + "</td><td class='advance-competitor'><button><span class='glyphicon glyphicon-arrow-right'></span></button></td>"));
            }
            return $matchups;
        } else if (slots === 1) {
            slots *= 2;
            rounds--;
            $matchups.append(bracket_html(competitors, rounds, seed, slots));
        } else {
            rounds--;
            if (seed === 1) {
                $matchups.append(bracket_html(competitors, rounds, seed, slots * 2));
                $matchups.append(bracket_html(competitors, rounds, slots + 1 - seed, slots * 2));
            } else {
                $matchups.append(bracket_html(competitors, rounds, slots + 1 - seed, slots * 2));
                $matchups.append(bracket_html(competitors, rounds, seed, slots * 2));
            }
            slots *= 2;
        }
        $bracket = $table.clone();
        if (slots === 2) {
            $bracket.find(".winner").addClass("champion").children(".connect-wrap").append($("<table class='matchup-group'></table").append(matchup_member(0, "winner", 0))).find(".connect").replaceWith(bracket_connector(0, 1));
            champion_header = "<th class='round-" + (rounds + 2) + "'>Champion</th>";
            if (tourney_type == 2) {
                round_labels[0] = "Final 1";
                champion_header = "<th class='round-" + (rounds + 2) + "'>Final 2</th><th class='round-" + (rounds + 2) + "'>Final 3 (if nec.)</th>" + champion_header;
                $placeholder.addClass("final").attr("data-game", round_base * 2 - 1);
                $bracket.find(".matchup").after($("<td class='winner round-" + (rounds + 2) + "'></td>").append($("<div class='connect-wrap'></div>").append($("<table class='matchup-group'></table").append($placeholder.attr("data-game", round_base * 2 - 1)).append(matchup_member(round_base * 2 - 1, "winner", round_base * 2 - 2))).append(bracket_connector(0, 2))));
                $bracket.find(".winner.champion").before($("<td class='winner if-necessary round-" + (rounds + 2) + "'></td>").append($("<div class='connect-wrap'></div>").append($("<table class='matchup-group'></table").append(matchup_member(round_base * 2, "loser", round_base * 2 - 1)).append(matchup_member(round_base * 2, "winner", round_base * 2 - 1))).append(bracket_connector(0, 2))));
            }
            for (i = 1; i <= rounds + 1; i++) {
                round_diff = rounds + 1 - i;
                if (round_diff < round_labels.length) {
                    round_text = round_labels[round_diff];
                } else {
                    round_text = "Round " + i;
                }
                $bracket_header.append("<span class='round-" + i + "'>" + round_text + "</span>");
            }
            $bracket.prop("class", "bracket").prepend($("<thead></thead>").append($("<tr class='bracket-header'></tr>").append($bracket_header).append(champion_header)));
        } else {
            $bracket.find(".winner").children(".connect-wrap").append($("<table class='matchup-group'></table").append($placeholder).append($placeholder2));
        }

        $bracket.find(".matchup").append($matchups.html());

        return $bracket;
    }
    
    var rounds = Math.ceil(Math.log2(competitors.length)),
        round1_byes = Math.pow(2, rounds) - competitors.length,
        currentIndex = competitors.length,
        temporaryValue,
        randomIndex;
    
    if (competitors.length > 1) {
        $("#slider-range").slider({
            range: true,
            min: 1,
            max: rounds + 1,
            values: [1, rounds + 1],
            change: function(event, ui) {
                var low_round = ui.values[0];
                var high_round = ui.values[1];
                for (i = 1; i < low_round; i++) {
                    $(".bracket-header .round-" + i).hide();
                    $(".losers-bracket table.round-" + i).hide();
                    $(".losers-bracket svg.connect.round-" + i).hide();
                    $(".bracket .winner>.connect-wrap>svg.connect.round-" + i).hide();
                }
                if (low_round > 1) {
                    $(".matchup.round-" + (low_round - 1)).hide();
                }
                for (i = low_round; i <= high_round; i++) {
                    $(".matchup.round-" + i).show();
                    $(".winner.round-" + i).show();
                    $(".bracket-header .round-" + i).show();
                    $(".losers-bracket .round-" + i).show();
                    if (i === 1) {
                        $(".bracket .winner>.connect-wrap>svg.connect.round-" + i).show();
                    } else if (i < high_round && i < rounds) {
                        var $connect_wrap = $(".bracket .winner.round-" + (i + 1) + ">.connect-wrap");
                        var $connect = $connect_wrap.children("svg.connect");
                        $connect.remove();
                        $connect_wrap.append(bracket_connector(i - low_round + 1, i - low_round + 1, 1, 1));
                        if (low_round > 1 && i > 2) {
                            $connect_wrap = $(".losers-bracket .winner.round-" + (i + 1) + " .matchup>.connect-wrap");
                            $connect = $connect_wrap.children("svg.connect");
                            $connect_wrap.children("svg.connect").remove();
                            $connect_wrap.append(bracket_connector(i - low_round + 1, i - low_round + 1, 1, 1));
                        }
                    }
                }
                for (i = high_round + 1; i <= rounds + 1; i++) {
                    $(".winner.round-" + i).hide();
                    $(".bracket-header .round-" + i).hide();
                }
            }
        });
        
        if (tourney_seeds == 2) {
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                temporaryValue = competitors[currentIndex];
                competitors[currentIndex] = competitors[randomIndex];
                competitors[randomIndex] = temporaryValue;
            }
        }

        for (i = 1; i <= round1_byes; i++) {
            competitors.push("Bye");
        }

        $(".bracket-wrap").html(bracket_html(competitors, rounds, 1, 1, tourney_type));
        if (tourney_type == 2) {
            $(".bracket-wrap").append(loser_bracket_html(round1_byes, rounds - 1).addClass("losers-bracket"));
            $('#view_options').show();
        } else {
            $('#view_options').hide();
        }
        
        if (rounds > 2) {
            $('#round_slider').show();
        } else {
            $('#round_slider').hide();
        }
        
        $(".matchup-member.bye").each(function () {
            if ($(this).hasClass("competitor")) {
                advance_competitor($(this));
            }
            $("svg.game-" + $(this).data("game")).attr("class", $("svg.game-" + $(this).data("game")).attr("class") + " bye");
        });
        $('#bracket_view').show().removeClass("hidden");
        $('#bracket_setup').hide();
    }
}

function advance_competitor($this) {
    'use strict';
    var game = $this.data("game"),
        $loser_competitor = $this.siblings("tr.competitor[data-game='" + game + "']");
    
    if ($this.hasClass("final")) {
        $(".champion").find(".matchup-member").html($this.html());
    } else {
        $("tr[data-winner='" + game + "']").addClass("competitor").html($this.html());
        var $loser = $("tr[data-loser='" + game + "']");
        $loser.addClass("competitor").html($loser_competitor.html());
        if ($loser.hasClass("bye")) {
            advance_competitor($loser);
        }
    }
    
    if (!$this.hasClass("bye")) {
        $this.addClass("winner").removeClass("loser");
        $loser_competitor.addClass("loser").removeClass("winner");
    }
}
