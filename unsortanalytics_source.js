/* 
unsortAnalytics.js bookmarklet commented javascript source code
2019 by Nazzareno Bedini, Università di Pisa
This is only for reference purpose, use the bookmarklet version in Ex Libris Alma Analytics (Oracle OBIEE) environment (look at README.md).
*/
var _t = "ANALYTICS UNSORT BookMarkLet by Nazzareno Bedini - Università di Pisa\n\n"; // title and author of the script
var _cid = "bediniupi0unsortcolumn"; // unsorting column id
var _saw = document.getElementsByName("XmlText")[0].value; // get the advanced xml textarea content 
var _mx = 4000; // max length of single string, Oracle doesn't like over 4k
if (_saw.indexOf(_cid) !== -1) {
     alert("Error: unsorting column already exists"); // column exist yet, exit
    return;
    }
var _ps = new DOMParser();
var _xm = _ps.parseFromString(_saw, "text/xml");
var _in = _xm.querySelectorAll('[op=in]')[0]; // find only first IN filter
var _ex = _in.getElementsByTagNameNS("com.siebel.analytics.web/expression/v1.1", "expr"); // extract all data from IN filter found
var _cln = "";
var _elf = "";
var _elr = [];
for (i = 0; i < _ex.length; i++) {
    if (_ex[i].getAttributeNS("http://www.w3.org/2001/XMLSchema-instance", "type") == "sawx:sqlExpression") {
        _cln = _ex[i].childNodes[0].nodeValue; // get the column name "Caption"."Column"
        } else {
         _elf += _ex[i].childNodes[0].nodeValue + ";"; // adding elements of IN filter
         if (_elf.length > (_mx - 500)) { // max string length with safety zone of 500k: if it is over that limit data are splitted in a array
             _elr.push(_elf);
             _elf = "";
             }
        }
}
if (!_cln) {
    alert("Error: IN filter not found."); // no column name, no filter found, exit.
    return;
} 
_elr.push(_elf); // last element (or the single element if it is < 3,5K ) on array
/*
 formula constructor: the base formula is LOCATE("Caption"."Column", 'element1;element2;....'), if the elements string is over 4K the formula is splitted like this:
     LOCATE("column", 'elemstring1') + LOCATE("column", "elemstring2") + 4000*SIGN(LOCATE("column", "elemstring2")) + LOCATE("column", "elemstring3") + 8000*SIGN(LOCATE("column", "elemstring3")) + ...
     The SIGN(x) function returns 0 if x=0, if x > 0 returns 1, so the result depends on the position of the string where the column value is:
     the general LOCATE("column", 'elements') = 357
     ELEMENT string where the column value is found  ||        Formula values            || Result
              elemstring1                            || 357 + 0 + 0 + 0 + 0 + ...  + 0   || 357
              elemstring2                            || 0 + 357 + 4000 + 0 + 0 + ... + 0 || 4357
              elemstring3                            || 0 + 0 + 0 + 357 + 8000 + ... + 0 || 8357
 and so on: the result value reflect the real order in the whole elements.
*/
var _fm = "";
for (j=0; j < _elr.length; j++) {
        
    var _my = _mx * j; // 0, 4000, 8000, 16000 and so on
    var _fo = "LOCATE(" + _cln + ", '" + _elr[j] + "')"; // base formula
    if (_my>0) _fo = _fo + " + " + _my + "*SIGN(" + _fo + ")"; // from the second string and over add the SIGN part
    _fm += _fo + " + ";
    }
_fm = _fm.substring(0, _fm.length-3); // trim last " + "
var _cn = "Calculated Position"; // unsorting column name
var _cp = _cln.split(".")[0].replace(/^\"+|\"+$/g, ''); // extract column caption from column name
var _nc = '<saw:column xsi:type="saw:regularColumn" columnID="'+_cid+'"><saw:columnFormula><sawx:expr xsi:type="sawx:sqlExpression">'+_fm+'</sawx:expr></saw:columnFormula><saw:tableHeading><saw:caption fmt="text"><saw:text>'+_cp+'</saw:text></saw:caption></saw:tableHeading><saw:columnHeading><saw:caption fmt="text"><saw:text>'+_cn+'</saw:text></saw:caption></saw:columnHeading></saw:column>'; // unsorting column definition
var _ns = '<saw:columnOrder><saw:columnOrderRef columnID="'+_cid+'" direction="ascending"/></saw:columnOrder>'; //unsorting column ascendig sorting
var _ned = '<saw:edgeLayer type="column" columnID="'+_cid+'"/>'; //unsorting column edge layer
var _rs = _saw.replace('</saw:columns>', _nc+'</saw:columns>'); // adding data near the end of the relative section section
_rs = _rs.replace('</saw:edgeLayers>', _ned+'</saw:edgeLayers>'); // adding data near the end of the relative section section
_rs = _rs.replace('</saw:criteria>', _ns+'</saw:criteria>'); // adding data near the end of the relative section section
var _c = confirm(_t + "Found IN filter in column " + _cln + " with " + _n + " elements to unsort.\nPress OK to update the Analysis, Cancel otherwise."); // Apply the modification message
if (_c) {
    document.getElementsByName("XmlText")[0].value = _rs; // update the advanced xml textarea content 
    document.getElementById("advancedTabApplyXmlButton").click(); // click on Apply XML button
}
