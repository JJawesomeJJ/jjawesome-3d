/**
 * Created by lizhenfang on 2020/8/10.
 */
var detailsParam = {
    pscode: "",
    outputcode: "",
    day: "",
    SystemType: "C16A882D480E678F",
    sgn: "",
    ts: "",
    tc: ""
  },
  dataUrl = {
    BaseInfo_BurnList: "OutInterface/GetBurnList.ashx",
    BaseInfo_PSInfo: "OutInterface/GetPSInfo.ashx",
    BaseInfo_RegionName: "OutInterface/GetRegionDetailItem.ashx"
  },
  psObject;
function initScrollbar() {
  $("#dataRowContent").mCustomScrollbar({
    theme: "light-3"
  });
  $("#monitorDataRowContent").mCustomScrollbar({
    theme: "light-3"
  })
}
initScrollbar();
function psBaseQuery(e) {
  var c = createCode(8),
    d = (new Date).valueOf();
  detailsParam.sgn = $.pscc(ctmy + d + c);
  detailsParam.tc = c;
  detailsParam.ts = d;
  detailsParam.pscode = e;
  $.ajax({
    type: "get",
    dataType: "json",
    url: dataUrl.BaseInfo_PSInfo,
    data: detailsParam,
    success: function(a) {
      0 < a.length && (psObject = a[0], $("#region_name").text(null != a[0].fullregion_name ? a[0].fullregion_name: "--"), $("#ps_name").text(null != a[0].ps_name ? a[0].ps_name: "--"), $("#address").text(null != a[0].address ? a[0].address: "--"), $("#credit_code").text(null != a[0].credit_code ? a[0].credit_code: "--"), $("#corporation_name").text(null != a[0].corporation_name ? a[0].corporation_name: "--"), $("#environment_principal").text(null != a[0].environment_principal ? a[0].environment_principal: "--"), $("#link_info").text(null != a[0].link_info ? a[0].link_info: "--"), $("#manufacture_date").text(null != a[0].manufacture_date ? a[0].manufacture_date: "--"), $("#boiler_num").text(null != a[0].boiler_num ? a[0].boiler_num: "--"), $("#burn_ability").text(null != a[0].burn_ability ? a[0].burn_ability: "--"), $("#electric_power").text(null != a[0].electric_power ? a[0].electric_power: "--"), window.parent.gzQuery(a[0].region_code, a[0].ps_code, a[0].ps_name))
    },
    error: function(a) {}
  });
  $.ajax({
    type: "get",
    dataType: "json",
    url: dataUrl.BaseInfo_BurnList,
    data: detailsParam,
    success: function(a) {
      $("#dataRow").empty();
      $.each(a,
        function(a, b) {
          null == b.boiler_type && (b.boiler_type = "--");
          null == b.burn_ability && (b.burn_ability = "--");
          null == b.creater_time && (b.creater_time = "--");
          $("#dataRow").append('\x3cli class\x3d"dataRowLi"\x3e\x3cdiv class\x3d"dataCol-1"\x3e' + b.boiler_name + '\x3c/div\x3e\x3cdiv class\x3d"dataCol-1"  style\x3d"margin-left:2px;"\x3e' + b.boiler_type + '\x3c/div\x3e\x3cdiv class\x3d"dataCol-1"  style\x3d"margin-left:2px;"\x3e' + b.creater_time + '\x3c/div\x3e\x3cdiv class\x3d"dataCol-1"\x3e' + b.burn_ability + "\x3c/div\x3e\x3c/li\x3e")
        })
    },
    error: function(a) {}
  })
};
