/**
 * Created by limp2 on 2020/8/9.
 */
var queryParam = {
    regionCode: "0",
    psname: "",
    SystemType: "C16A882D480E678F",
    sgn: "",
    ts: "",
    tc: ""
  },
  queryParamGroup = {
    afgroupcode: "0",
    psname: "",
    SystemType: "C16A882D480E678F",
    sgn: "",
    ts: "",
    tc: ""
  },
  pagerParam = {
    pageNo: "1",
    pageSize: "15",
    total: "C16A882D480E678F"
  },
  pList = [],
  dataUrl = {
    PSList_Default: "OutInterface/GetPSList.ashx",
    PSList_Group: "OutInterface/GetAFGroupPSList.ashx",
    PSList_GZ: "OutInterface/GetFaultNoticeList.ashx",
    Region_Foucs: "OutInterface/GetRegionItem.ashx"
  },
  map,
  zoom = 5;
function gzQuery(b, e, g) {
  e = createCode(8);
  g = (new Date).valueOf();
  queryParam.sgn = $.pscc(ctmy + g + e);
  queryParam.tc = e;
  queryParam.ts = g;
  $.ajax({
    type: "get",
    dataType: "json",
    url: dataUrl.PSList_GZ,
    data: {
      regionCode: b,
      sgn: queryParam.sgn,
      tc: queryParam.tc,
      ts: queryParam.ts
    },
    success: function(e) {
      if (0 < e.length) {
        var f = e[0];
        e = "\u7531\u4e8e" + (null != f.reason ? f.reason: "") + "\u6545\u969c\uff0c\u5f71\u54cd" + (null != f.regionName ? f.regionName: "") + "\u5783\u573e\u711a\u70e7\u53d1\u7535\u5382\u6570\u636e\u4f20\u8f93\u4ee5\u53ca\u4fe1\u606f\u516c\u5f00\uff0c\u5f85\u6545\u969c\u6062\u590d\u540e\uff0c\u6545\u969c\u671f\u95f4\u81ea\u52a8\u76d1\u6d4b\u5386\u53f2\u6570\u636e\u5c06\u4f1a\u516c\u5f00\u3002";
        var b = "\u6545\u969c\u5f00\u59cb\u65f6\u95f4\uff1a" + (null != f.begin_time ? f.begin_time: ""),
          g = "\u9884\u8ba1\u6062\u590d\u65f6\u95f4\uff1a" + (null != f.end_time ? f.end_time: ""),
          h = (null != f.public_unit ? f.public_unit: "") + "",
          f = null != f.public_time ? f.public_time: "";
        $("#gzLK").text(h);
        $("#gzLK2").text(f.split("-")[0] + "\u5e74" + f.split("-")[1] + "\u6708" + f.split("-")[2] + "\u65e5");
        $("#gzTxt").text(e);
        $("#gzBT").text(b);
        $("#gzET").text(g);
        $("#tips_gz").show();
        $("#psWindow").hide()
      } else $("#tips_gz").hide(),
        $("#psWindow").show()
    },
    error: function(e) {}
  })
}
function showStopMonitor(b) {
  $("#stopTime").text(b.stopopen_time.substr(0, 10).split("-")[0] + "\u5e74" + b.stopopen_time.substr(0, 10).split("-")[1] + "\u6708" + b.stopopen_time.substr(0, 10).split("-")[2] + "\u65e5");
  $("#stopPSName").text($("#psName").text());
  $("#stopMpName").text(b.boiler_name);
  $("#stopResult").text(b.stopopen_reason);
  $("#tips2").show()
}
function hideStopMonitor() {
  $("#tips2").hide()
}
function show(b, e, g) {
  null == g || "null" == g || "NULL" == g ? ($("#winTitle").text(e), $("#psInfoFrame")[0].contentWindow.psBaseQuery(b), $("#psMonitorDataFrame")[0].contentWindow.initOuputListInfo(b)) : window.open(g);
  $("#psName").text(e)
}
$(document).ready(function() {
  function b() {
    map.clearOverLays();
    queryParam.psname = $("#searchInput").val().trim();
    var c = getUrlParam("rg"),
      a = getUrlParam("grcode"),
      b = createCode(8),
      h = (new Date).valueOf();
    queryParam.sgn = $.pscc(ctmy + h + b);
    queryParam.tc = b;
    queryParam.ts = h;
    queryParamGroup.sgn = queryParam.sgn;
    queryParamGroup.tc = queryParam.tc;
    queryParamGroup.ts = queryParam.ts;
    null != c ? (queryParam.regionCode = c, $.ajax({
      type: "get",
      dataType: "json",
      url: dataUrl.PSList_Default,
      data: queryParam,
      success: function(a) {
        pList = a;
        pagerParam.pageNo = 1;
        pagerParam.total = pList.length;
        $("#pageCNo").text("\u7b2c1/" + Math.ceil(pagerParam.total / pagerParam.pageSize) + "\u9875");
        $("#pListul").empty();
        $.each(pList,
          function(a, d) {
            var c = new T.LngLat(d.longitude, d.latitude),
              b = new T.Marker(c, {
                icon: p
              });
            b.id = a;
            b.addEventListener("mouseover", g);
            b.addEventListener("mouseout", l);
            b.addEventListener("click", e);
            f.push(b);
            m.push(c);
            map.addOverLay(b);
            a >= (pagerParam.pageNo - 1) * pagerParam.pageSize && a < pagerParam.pageNo * pagerParam.pageSize && (21 < d.ps_name.length ? $("#pListul").append("\x3cli  onclick\x3d\"show('" + d.ps_code + "','" + d.ps_name + "','" + d.error_web + '\')" title\x3d"' + d.ps_name + '"\x3e\x3cspan class\x3d"pIcon"\x3e\x3c/span\x3e\x3cspan id\x3d"lPname" class\x3d"lPname"\x3e' + d.ps_name.substr(0, 20) + "...\x3c/span\x3e\x3c/li\x3e") : $("#pListul").append("\x3cli  onclick\x3d\"show('" + d.ps_code + "','" + d.ps_name + "','" + d.error_web + '\')" \x3e\x3cspan class\x3d"pIcon"\x3e\x3c/span\x3e\x3cspan id\x3d"lPname" class\x3d"lPname"\x3e' + d.ps_name + "\x3c/span\x3e\x3c/li\x3e"))
          })
      },
      error: function(a) {}
    }), $.ajax({
      type: "get",
      dataType: "json",
      url: dataUrl.Region_Foucs,
      data: queryParam,
      success: function(a) {
        0 < a.length && map.centerAndZoom(new T.LngLat(a[0].longitude, a[0].latitude), 6)
      },
      error: function(a) {}
    })) : null != a ? (queryParamGroup.afgroupcode = a, $.ajax({
      type: "get",
      dataType: "json",
      url: dataUrl.PSList_Group,
      data: queryParamGroup,
      success: function(a) {
        pList = a;
        pagerParam.pageNo = 1;
        pagerParam.total = pList.length;
        $("#pageCNo").text("\u7b2c1/" + Math.ceil(pagerParam.total / pagerParam.pageSize) + "\u9875");
        $("#pListul").empty();
        $.each(pList,
          function(a, d) {
            var c = new T.LngLat(d.longitude, d.latitude),
              b = new T.Marker(c, {
                icon: p
              });
            b.id = a;
            b.addEventListener("mouseover", g);
            b.addEventListener("mouseout", l);
            b.addEventListener("click", e);
            f.push(b);
            m.push(c);
            map.addOverLay(b);
            a >= (pagerParam.pageNo - 1) * pagerParam.pageSize && a < pagerParam.pageNo * pagerParam.pageSize && (21 < d.ps_name.length ? $("#pListul").append("\x3cli  onclick\x3d\"show('" + d.ps_code + "','" + d.ps_name + "','" + d.error_web + '\')" title\x3d"' + d.ps_name + '"\x3e\x3cspan class\x3d"pIcon"\x3e\x3c/span\x3e\x3cspan id\x3d"lPname" class\x3d"lPname"\x3e' + d.ps_name.substr(0, 20) + "...\x3c/span\x3e\x3c/li\x3e") : $("#pListul").append("\x3cli  onclick\x3d\"show('" + d.ps_code + "','" + d.ps_name + "','" + d.error_web + '\')" \x3e\x3cspan class\x3d"pIcon"\x3e\x3c/span\x3e\x3cspan id\x3d"lPname" class\x3d"lPname"\x3e' + d.ps_name + "\x3c/span\x3e\x3c/li\x3e"))
          })
      },
      error: function(a) {}
    })) : $.ajax({
      type: "get",
      dataType: "json",
      url: dataUrl.PSList_Default,
      data: queryParam,
      success: function(a) {
        pList = a;
        pagerParam.pageNo = 1;
        pagerParam.total = pList.length;
        $("#pageCNo").text("\u7b2c1/" + Math.ceil(pagerParam.total / pagerParam.pageSize) + "\u9875");
        $("#pListul").empty();
        $.each(pList,
          function(a, d) {
            var b = new T.LngLat(d.longitude, d.latitude),
              c = new T.Marker(b, {
                icon: p
              });
            c.id = a;
            c.addEventListener("mouseover", g);
            c.addEventListener("mouseout", l);
            c.addEventListener("click", e);
            f.push(c);
            m.push(b);
            map.addOverLay(c);
            a >= (pagerParam.pageNo - 1) * pagerParam.pageSize && a < pagerParam.pageNo * pagerParam.pageSize && (21 < d.ps_name.length ? $("#pListul").append("\x3cli  onclick\x3d\"show('" + d.ps_code + "','" + d.ps_name + "','" + d.error_web + '\')" title\x3d"' + d.ps_name + '"\x3e\x3cspan class\x3d"pIcon"\x3e\x3c/span\x3e\x3cspan id\x3d"lPname" class\x3d"lPname"\x3e' + d.ps_name.substr(0, 20) + "...\x3c/span\x3e\x3c/li\x3e") : $("#pListul").append("\x3cli  onclick\x3d\"show('" + d.ps_code + "','" + d.ps_name + "','" + d.error_web + '\')" \x3e\x3cspan class\x3d"pIcon"\x3e\x3c/span\x3e\x3cspan id\x3d"lPname" class\x3d"lPname"\x3e' + d.ps_name + "\x3c/span\x3e\x3c/li\x3e"))
          })
      },
      error: function(a) {}
    })
  }
  $("#pageTitleContent").width($(window).width() - 50);
  $(window).resize(function() {
    $("#pageTitleContent").width($(window).width() - 50);
    $("#psWindow").css({
      left: ($(window).width() - 300 - 900) / 2
    });
    $("#psWindow").css({
      top: ($(window).height() - 600) / 2 - ($(window).height() - 600) / 2 / 2
    });
    $("#gksm").css({
      left: ($(window).width() - 707) / 2
    });
    $("#gksm").css({
      top: ($(window).height() - 311) / 2
    });
    $("#gkClose").css({
      left: ($(window).width() - 707) / 2 + 707
    });
    $("#gkClose").css({
      top: ($(window).height() - 311) / 2
    });
    $("#gzsm").css({
      left: ($(window).width() - 707) / 2
    });
    $("#gzsm").css({
      top: ($(window).height() - 311) / 2
    });
    $("#gzClose").css({
      left: ($(window).width() - 707) / 2 + 700
    });
    $("#gzClose").css({
      top: ($(window).height() - 306) / 2
    });
    $("#gksm2").css({
      left: ($(window).width() - 707) / 2
    });
    $("#gksm2").css({
      top: ($(window).height() - 311) / 2
    });
    $("#gkClose2").css({
      left: ($(window).width() - 707) / 2 + 707
    });
    $("#gkClose2").css({
      top: ($(window).height() - 311) / 2
    })
  });
  $("#psWindow").css({
    left: ($(window).width() - 300 - 900) / 2
  });
  $("#psWindow").css({
    top: ($(window).height() - 600) / 2 - ($(window).height() - 600) / 2 / 2
  });
  $("#gksm").css({
    left: ($(window).width() - 707) / 2
  });
  $("#gksm").css({
    top: ($(window).height() - 311) / 2
  });
  $("#gkClose").css({
    left: ($(window).width() - 707) / 2 + 700
  });
  $("#gkClose").css({
    top: ($(window).height() - 306) / 2
  });
  $("#gzsm").css({
    left: ($(window).width() - 707) / 2
  });
  $("#gzsm").css({
    top: ($(window).height() - 311) / 2
  });
  $("#gzClose").css({
    left: ($(window).width() - 707) / 2 + 700
  });
  $("#gzClose").css({
    top: ($(window).height() - 306) / 2
  });
  $("#gksm2").css({
    left: ($(window).width() - 707) / 2
  });
  $("#gksm2").css({
    top: ($(window).height() - 311) / 2
  });
  $("#gkClose2").css({
    left: ($(window).width() - 707) / 2 + 701
  });
  $("#gkClose2").css({
    top: ($(window).height() - 311) / 2 + 6
  });
  $("#gkClose2").click(function() {
    $("#tips2").hide()
  });
  $("#tips").show();
  $("#gkClose").click(function() {
    $("#tips").hide()
  });
  $("#gzClose").click(function() {
    $("#tips_gz").hide();
    $("#psWindow").show()
  });
  $("#winClose").click(function() {
    $("#psWindow").hide()
  });
  $(document).keydown(function(c) {
    13 == c.keyCode && ($("#searchBtn").triggerHandler("click"), "none" == $("#psListPanel").css("display") && $("#psListPanel").slideToggle("normal"))
  });
  $(".psInfoTab").click(function() {
    $(".psInfoTab");
    $(".psInfoTab").removeClass("tabSelected");
    $(this).addClass("tabSelected");
    switch (this.id) {
      case "baseinfo":
        $("#psInfoFrame").css({
          display:
            "block"
        });
        $("#psMonitorDataFrame").css({
          display:
            "none"
        });
        break;
      case "monitordata":
        $("#psMonitorDataFrame").css({
          display:
            "block"
        }),
          $("#psInfoFrame").css({
            display: "none"
          }),
          $("#psMonitorDataFrame")[0].contentWindow.setTabControl()
    }
  });
  $("#psListShowBtn").click(function() {
    $("#psListPanel").slideToggle("normal")
  });
  var e = function(c) {
      show(pList[c.target.id].ps_code, pList[c.target.id].ps_name, pList[c.target.id].error_web)
    },
    g = function(c) {
      $("#pName").show();
      $("#pName").text(pList[c.target.id].ps_name);
      var a = c.containerPoint.y - 35 - 7,
        a = 0 > a ? 0 : a;
      $("#pName").offset({
        left: c.containerPoint.x + 3,
        top: a
      })
    },
    l = function(c) {
      $("#pName").hide();
      $("#pName").hide = c.layerPoint.x
    },
    f = [],
    m = [];
  map = new T.Map("mapContainer");
  var k = new T.TileLayer("http://t5.tianditu.gov.cn/DataServer?T\x3dimg_w\x26l\x3d{z}\x26y\x3d{y}\x26x\x3d{x}\x26tk\x3d98007a6cb1a3dda4af6c68ee454df3a5", {
    minZoom: 1,
    maxZoom: 18
  });
  k.id = "yxt";
  var h = new T.TileLayer("http://t5.tianditu.gov.cn/DataServer?T\x3dcia_w\x26l\x3d{z}\x26y\x3d{y}\x26x\x3d{x}\x26tk\x3d98007a6cb1a3dda4af6c68ee454df3a5", {
    minZoom: 1,
    maxZoom: 18
  });
  h.id = "yxt2";
  var n = new T.TileLayer("http://t2.tianditu.gov.cn/DataServer?T\x3dibo_w\x26l\x3d{z}\x26y\x3d{y}\x26x\x3d{x}\x26tk\x3d98007a6cb1a3dda4af6c68ee454df3a5", {
    minZoom: 1,
    maxZoom: 18
  });
  n.id = "yxt3";
  map.centerAndZoom(new T.LngLat(110.40769, 36.29945), zoom);
  var p = new T.Icon({
      iconUrl: "static/GM/mapImages/point.png",
      iconSize: new T.Point(22, 22),
      iconAnchor: new T.Point(11, 11)
    }),
    q = !0;
  map.removeLayer(k);
  map.removeLayer(h);
  map.removeLayer(n);
  $("#sat").removeClass("on");
  $("#sat").click(function() {
    q ? (map.addLayer(k), map.addLayer(h), map.addLayer(n), $("#sat").addClass("on")) : (map.removeLayer(n), map.removeLayer(h), map.removeLayer(k), $("#sat").removeClass("on"));
    q = !q
  });
  $("#searchBtn").click(function() {
    b();
    "none" == $("#psListPanel").css("display") && $("#psListPanel").slideToggle("normal")
  });
  $("#pageFirst").click(function() {
    pagerParam.pageNo = 1;
    $("#pageCNo").text("\u7b2c" + pagerParam.pageNo + "/" + Math.ceil(pagerParam.total / pagerParam.pageSize) + "\u9875");
    $("#pListul").empty();
    $.each(pList,
      function(c, a) {
        c >= (pagerParam.pageNo - 1) * pagerParam.pageSize && c < pagerParam.pageNo * pagerParam.pageSize && (21 < a.ps_name.length ? $("#pListul").append("\x3cli  onclick\x3d\"show('" + a.ps_code + "','" + a.ps_name + "','" + a.error_web + '\')" title\x3d"' + a.ps_name + '"\x3e\x3cspan class\x3d"pIcon"\x3e\x3c/span\x3e\x3cspan id\x3d"lPname" class\x3d"lPname"\x3e' + a.ps_name.substr(0, 20) + "...\x3c/span\x3e\x3c/li\x3e") : $("#pListul").append("\x3cli  onclick\x3d\"show('" + a.ps_code + "','" + a.ps_name + "','" + a.error_web + '\')" \x3e\x3cspan class\x3d"pIcon"\x3e\x3c/span\x3e\x3cspan id\x3d"lPname" class\x3d"lPname"\x3e' + a.ps_name + "\x3c/span\x3e\x3c/li\x3e"))
      })
  });
  $("#pageUp").click(function() {
    1 < pagerParam.pageNo && (pagerParam.pageNo--, $("#pageCNo").text("\u7b2c" + pagerParam.pageNo + "/" + Math.ceil(pagerParam.total / pagerParam.pageSize) + "\u9875"), $("#pListul").empty(), $.each(pList,
      function(c, a) {
        c >= (pagerParam.pageNo - 1) * pagerParam.pageSize && c < pagerParam.pageNo * pagerParam.pageSize && (21 < a.ps_name.length ? $("#pListul").append("\x3cli  onclick\x3d\"show('" + a.ps_code + "','" + a.ps_name + "','" + a.error_web + '\')" title\x3d"' + a.ps_name + '"\x3e\x3cspan class\x3d"pIcon"\x3e\x3c/span\x3e\x3cspan id\x3d"lPname" class\x3d"lPname"\x3e' + a.ps_name.substr(0, 20) + "...\x3c/span\x3e\x3c/li\x3e") : $("#pListul").append("\x3cli  onclick\x3d\"show('" + a.ps_code + "','" + a.ps_name + "','" + a.error_web + '\')" \x3e\x3cspan class\x3d"pIcon"\x3e\x3c/span\x3e\x3cspan id\x3d"lPname" class\x3d"lPname"\x3e' + a.ps_name + "\x3c/span\x3e\x3c/li\x3e"))
      }))
  });
  $("#pageNext").click(function() {
    pagerParam.pageNo < Math.ceil(pagerParam.total / pagerParam.pageSize) && (pagerParam.pageNo++, pagerParam.total = pList.length, $("#pageCNo").text("\u7b2c" + pagerParam.pageNo + "/" + Math.ceil(pagerParam.total / pagerParam.pageSize) + "\u9875"), $("#pListul").empty(), $.each(pList,
      function(c, a) {
        c >= (pagerParam.pageNo - 1) * pagerParam.pageSize && c < pagerParam.pageNo * pagerParam.pageSize && (21 < a.ps_name.length ? $("#pListul").append("\x3cli  onclick\x3d\"show('" + a.ps_code + "','" + a.ps_name + "','" + a.error_web + '\')" title\x3d"' + a.ps_name + '"\x3e\x3cspan class\x3d"pIcon"\x3e\x3c/span\x3e\x3cspan id\x3d"lPname" class\x3d"lPname"\x3e' + a.ps_name.substr(0, 20) + "...\x3c/span\x3e\x3c/li\x3e") : $("#pListul").append("\x3cli  onclick\x3d\"show('" + a.ps_code + "','" + a.ps_name + "','" + a.error_web + '\')" \x3e\x3cspan class\x3d"pIcon"\x3e\x3c/span\x3e\x3cspan id\x3d"lPname" class\x3d"lPname"\x3e' + a.ps_name + "\x3c/span\x3e\x3c/li\x3e"))
      }))
  });
  $("#pageLast").click(function() {
    pagerParam.pageNo = Math.ceil(pagerParam.total / pagerParam.pageSize);
    $("#pageCNo").text("\u7b2c" + pagerParam.pageNo + "/" + Math.ceil(pagerParam.total / pagerParam.pageSize) + "\u9875");
    $("#pListul").empty();
    $.each(pList,
      function(c, a) {
        c >= (pagerParam.pageNo - 1) * pagerParam.pageSize && c < pagerParam.pageNo * pagerParam.pageSize && (21 < a.ps_name.length ? $("#pListul").append("\x3cli  onclick\x3d\"show('" + a.ps_code + "','" + a.ps_name + "','" + a.error_web + '\')" title\x3d"' + a.ps_name + '"\x3e\x3cspan class\x3d"pIcon"\x3e\x3c/span\x3e\x3cspan id\x3d"lPname" class\x3d"lPname"\x3e' + a.ps_name.substr(0, 20) + "...\x3c/span\x3e\x3c/li\x3e") : $("#pListul").append("\x3cli  onclick\x3d\"show('" + a.ps_code + "','" + a.ps_name + "','" + a.error_web + '\')" \x3e\x3cspan class\x3d"pIcon"\x3e\x3c/span\x3e\x3cspan id\x3d"lPname" class\x3d"lPname"\x3e' + a.ps_name + "\x3c/span\x3e\x3c/li\x3e"))
      })
  });
  b()
});
function moveObj(b) {
  var e = document.getElementById(b),
    g = 0,
    l = 0,
    f = 0,
    m = 0,
    k = !1;
  e.onmousedown = function(b) {
    g = b.clientX;
    l = b.clientY;
    f = e.offsetLeft;
    m = e.offsetTop;
    k = !0;
    e.style.cursor = "move"
  };
  window.onmousemove = function(b) {
    if (0 != k) {
      var h = b.clientY - (l - m);
      e.style.left = b.clientX - (g - f) + "px";
      e.style.top = h + "px"
    }
  };
  e.onmouseup = function() {
    k = !1;
    e.style.cursor = "default"
  }
}
moveObj("psWindow");
