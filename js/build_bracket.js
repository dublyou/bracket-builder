function add_competitor(name) {
    if (name !== "" && name !== undefined) {
        var $competitors = $("#competitors");
        var competitor_list_item = '<li class="list-group-item low-padding-vert" draggable="true"><span class="competitor-seed">' + ($competitors.children().length + 1) + '</span><span class="competitor-name">' + name + '</span><button type="button" class="close" aria-label="Remove"><span class="glyphicon text-danger glyphicon-remove" aria-hidden="true"></span></button></li>'
        $competitors.append(competitor_list_item);
    }
}

$(document).ready(function () {
    'use strict';
    $("body").on("dblclick", ".matchup-member.competitor", function () {
        advance_competitor($(this));
    }).on("mousedown", ".matchup-member.competitor", function (e) {
        e.preventDefault();
    }).on("click", "#build_bracket", function () {
        var tourney_type = $("[name=tourney_type]:checked").val(),
            tourney_seeds = $("[name=tourney_seeds]:checked").val(),
            competitors = [],
            $competitor = $('<div><button type="button" class="btn btn-default btn-sm flex" style="padding:0;padding-right:4px;width:100%;text-align:left;"><span class="fit-width no-padding-vert" style="margin: -1px"><img width="30px" height="30px" style="border-radius: 4px 0 0 4px" src="/static/svg/profile_inv.png" alt="competitor"/></span><span class="competitor-name no-padding-vert width-100 text-left text-sm" style="margin-left: 5px"></span></button></div>');
        $("#competitors").children().each( function () {
            var $competitor_clone = $competitor.clone();
            $competitor_clone.find(".competitor-name").html($(this).children(".competitor-name").text());
            competitors.push($competitor_clone.html());
        });
        build_bracket(tourney_type, tourney_seeds, competitors);
    }).on("change", "[name=view_options]", function () {
        if ($(this).is(":checked")) {
            $("." + $(this).val()).show();
        } else {
            $("." + $(this).val()).hide();
        }
    }).on("click", ".matchup-member.competitor>.advance-competitor", function () {
        advance_competitor($(this).parent(".matchup-member.competitor"));
    }).on("click", ".ui-slider-handle button", function (e) {
        var slider_range = $("#slider-range"),
            values = slider_range.slider("values"),
            bound = parseInt($(this).data("bound")),
            increment = parseInt($(this).data("increment")),
            new_value = values[bound] + increment,
            difference = values[bound] - values[Math.abs(bound - 1)];
        if (difference === 0) {
            values[Math.max(increment, 0)] = new_value;
            slider_range.slider("values", values);
        } else if (Math.max(difference * bound, difference * (bound - 1)) > 0) {
            values[bound] = new_value;
            slider_range.slider("values", values);
        }
    }).on("click", ".close", function() {
        $(this).closest("li").remove();
        $("#competitors").children().each(function(i) {
            $(this).children(".competitor-seed").html(i + 1);
        });
    });
    $("#add_competitor").click( function(e) {
        e.preventDefault(); // Ensure it is only this code that runs
        add_competitor($("#competitor_name").val());
    });
    $("#competitor_name").keypress(function(e) {
        if(e.keyCode === 13){
            e.preventDefault(); // Ensure it is only this code that runs
            add_competitor($(this).val());
        }
    });
});
