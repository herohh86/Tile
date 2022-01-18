function Tile(a) {
    var that = this;
    this.$that = a;
    this.$that.data("ctrl", that);
    this.box = $(null);
    this._elements = {};
    this.SaveLayOut = null;
    this.Config = {
        min: "min",
        mintext: "收起",
        max: "max",
        maxtext: "展开",
        close: "close",
        closetext: "\u5173\u95ed",
        refreshtext: "刷新",
        refresh: "tileRefresh",
        more: "more",
        moretext: "更多",
        _groupItemContent: "itemContent",
        _groupItemHead: "itemHeader",
        _groupWrapperClass: "groupWrapper",
        _groupItemClass: "groupItem"
    };
    this.Layout = {
        location: {
            left: "portal_l",
            center: "portal_m",
            right: "portal_r"
        },
        locationId: {
            left: "#portal_l",
            center: "#portal_m",
            right: "#portal_r"
        },
        layoutCss: {
            0 : "1:2",
            1 : "2:1",
            2 : "1:1:1",
            3 : "1:1",
            4 : "1:2:1"
        },
        layoutText: {
            0 : "w333 w666 wnone",
            1 : "w666 w333 wnone",
            2 : "w333 w333 w333",
            3 : "w500 wnone w500",
            4 : "w250 w500 w250",
        }
    };
    this.Util = {
        format: function(d, e) {
            for (var f in e) {
                d = d.replace(RegExp("{" + f + "}", "g"), e[f])
            }
            return d
        },
        refresh: function() {
            $("#" + that.Layout.left, "#" + that.Layout.center, "#" + that.Layout.right).sortable("refresh")
        },
        toBody: function(c) {
            that.$that.append(c)
        }
    };
    this.leftPart = "<div id='" + that.Layout.location.left + "' class='" + that.Config._groupWrapperClass + " w333'/>";
    this.middlePart = "<div id='" + that.Layout.location.center + "' class='" + that.Config._groupWrapperClass + " w333'/>";
    this.rightPart = "<div id='" + that.Layout.location.right + "' class='" + that.Config._groupWrapperClass + " w333'/>";
    this.tileContainer = "<div id='{key}' class='" + that.Config._groupItemClass + "' style='position:relative;min-height:65px;'/>";
    this.tileTitle = "<div class='" + that.Config._groupItemHead + "'><h3>{name}</h3></div>";
    this.tileContent = "<div class='" + that.Config._groupItemContent + "'/>";
    this.moduleIds = null;
    this.init = function(layoutInfo) {
        that._clear();
        that._create();
        that._bindData(layoutInfo);
        that._bindEvent();
    };
    this._clear = function() {
        that.$that.empty()
    };
    this._create = function() {
        that.box = $("<div id='portal'></div>");
        that._elements = {};
        that._createModulesWrap();
        that.Util.toBody(that.box)
    };
    this._bindData = function(layoutInfo) {
        $.each(layoutInfo, function(part, tiles) {
            that._createPortal(part, tiles);
        });
    };
    this._createModulesWrap = function() {
        that._elements.m_l = $(that.leftPart);
        that._elements.m_r = $(that.rightPart);
        that._elements.m_m = $(that.middlePart);
        that._addPanel(that._elements.m_l);
        that._addPanel(that._elements.m_m);
        that._addPanel(that._elements.m_r)
    };
    this._addPanel = function(c) {
        that.box.append(c)
    };
    this._createPortal = function(part, tiles) {
        var partContainer;
        switch (part) {
        case "hpLeft":
            partContainer = that._elements.m_l;
            break;
        case "hpMiddle":
            partContainer = that._elements.m_m;
            break;
        case "hpRight":
            partContainer = that._elements.m_r;
            break
        }
        $.each(tiles, function(index, tile) {
            partContainer.append(that._createPortalOne(tile.id, tile.name))
        });
    };
    this._createPortalOne = function(tileId, tileTitle) {
        var $portal = $(that.Util.format(that.tileContainer, { key: tileId }));

		var $tileTitle = that._createItemHeader(tileTitle);
		$portal.append($tileTitle);

        var $tileBody = that._createItemContent();
        $portal.append($tileBody);
        return $portal
    };
    this._createItemHeader = function(tileTitle) {
        var $tileTitle = $(that.Util.format(that.tileTitle, { name: tileTitle }));
        var $tileAction = that._createDiv("action").hide().appendTo($tileTitle);
        that._createA(that.Config.min, that.Config.mintext, !0).appendTo($tileAction);
        that._createA(that.Config.max, that.Config.maxtext, !1).appendTo($tileAction);
        $tileTitle.hover(function() {
            $(this).find(".action").show();
        }, function() {
            $(this).find(".action").hide();
        });
        return $tileTitle;
    };
    this._createItemContent = function() {
        var $tileBody = $(that.tileContent);
        return $tileBody;
    };
    this._createDiv = function(className) {
        return $("<div/>").addClass(className);
    };
    this._createA = function(className, actionText, isShow) {
        var $action = $("<a href='javascript:void(0);' class='" + className + "' title='" + actionText + "'/>");
        isShow || $action.hide();
        return $action;
    };
    this._eventMin = function() {
        $("." + that.Config.min).on("click", function() {
            var $this = $(this);
            var d = $this.parent().parent().parent();
            d.find("." + that.Config._groupItemContent).hide();
            d.find("." + that.Config.max).show();
            $this.hide();
        });
    };
    this._eventMax = function() {
        $("." + that.Config.max).on("click", function() {
            var c = $(this);
            var d = c.parent().parent().parent();
            d.find("." + that.Config._groupItemContent).show();
            d.find("." + that.Config.min).show();
            c.hide();
        });
    };
    this._eventRefresh = function() {
        $("." + that.Config.refresh).on("click", function() {
            $(this).parent().parent().parent().find("ul").empty().append("<li>刷新了</li>")
        })
    };
	//允许磁贴拖动排序事件
    this._eventSortable = function() {
        $("." + that.Config._groupWrapperClass).sortable({
            connectWith: "." + that.Config._groupWrapperClass,
            opacity: "0.6",
            dropOnEmpty: !0,
            revert: true,
            delay: 200,
            distance: 50,
			/*
				over事件处理一些拖拽过后的事情
			*/
            over: function(event, ui) {
                console.log("sortable orver");
            },
            update: function(event, ui) {
                console.log("sortable update.");
            }
        }).disableSelection()
    };
    this._bindEvent = function() {
        that._eventSortable();
        that._eventRefresh();
		that._eventMax();
		that._eventMin();
    };
    this.toLayout = function(layoutProportion) {
        var layoutCollection = that.Layout.layoutText,
        portalCollection = that.Layout.locationId,
        index = 0,
        moduleIds = "";
        $.each(that.Layout.layoutCss, function(i, proportion) {
            layoutProportion == proportion && (index = i)
        });
        $.each(portalCollection,
        function(i, portal) {
            var $portal = $(portal),
            styleArr = layoutCollection[index].split(/\s+/);
            switch (i) {
            case "left":
                j = 0;
                break;
            case "center":
                j = 1;
                break;
            case "right":
                j = 2
            }
            if ("wnone" == styleArr[j]) {
                moduleIds = $portal.sortable("toArray");
                $.each(moduleIds, function(i, moduleId) {
                    $("#" + that.Layout.location.left).append($("#" + moduleId))
                });
                $portal.empty()
            }
            $portal.removeClass("w250 w333 w500 w666 w750 wnone").addClass(styleArr[j]);
            return true
        })
    }
};