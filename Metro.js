// Marunouchi.Branch
function loopSleep(_loopLimit,_interval, _mainFunc){
  var loopLimit = _loopLimit;
  var interval = _interval;
  var mainFunc = _mainFunc;
  var i = 0;
  var loopFunc = function () {
    var result = mainFunc(i);
    if (result === false) {
      // break機能
      return;
    }
    i = i + 1;
    if (i < loopLimit) {
      setTimeout(loopFunc, interval);
    }
  }
  loopFunc();
} 

var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

function morph( f, t, d )
{ return f+(t-f)/d; }

var tim = 0;

//var vs = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];

// 銀座線・千代田線・有楽町線の region がなんかおかしい
lines[0][1].reverse();
Array.prototype.push.apply( lines[0][0], lines[0][1] );
lines[0].pop();
lines[4][0].reverse();
lines[4][3].reverse();
Array.prototype.push.apply( lines[4][1], lines[4][3] );
Array.prototype.push.apply( lines[4][0], lines[4][1] );
lines[4].pop();
lines[4].pop();
lines[4].pop();
Array.prototype.push.apply( lines[5][0], lines[5][1] );
lines[5].pop();
lines[5].pop();

var minLon = 1000000, maxLon = -10000000, minLat = 1000000, maxLat = -10000000;
var statIdx = new Array(9);
var lineIdx = new Array(9);
var alts = new Array(9);
var trains = (new Array(9)).fill([]);
var trNames = {};

for( var i = 0; i < 9; ++i )
  trains[i] = [];

for( let i = 0; i < 9; ++i ) {
  statIdx[i] = new Array(lines[i].length);
  alts[i] = new Array(lines[i].length);
  lineIdx[i] = (new Array(stats[i].length)).fill(-1); 
  
  for( let j = 0; j < lines[i].length; ++j ) { 
    statIdx[i][j] = (new Array(lines[i][j].length)).fill(-1);
    alts[i][j] = (new Array(lines[i][j].length)).fill(-1);

    for( let k = 0; k < lines[i][j].length; ++k )
    {
      minLon = Math.min( minLon, lines[i][j][k].lon );
      maxLon = Math.max( maxLon, lines[i][j][k].lon );
      minLat = Math.min( minLat, lines[i][j][k].lat );
      maxLat = Math.max( maxLat, lines[i][j][k].lat );
    }
  }
}

// statIdx[i: line][j: region][k: idx of lines] = stat: idx of stats
// lineIdx[i: line][j: idx of stats] = {i: line, j: region, k: idx of lines}

var cnt = 0;
for( var i = 0; i < 9; ++i ) for( var m = 0; m < stats[i].length; ++m )
{
  var mindist = 100000000, mij = [], mik;

  for( var j = 0; j < lines[i].length; ++j ) for( var k = 0; k < lines[i][j].length; ++k )
  {
    var dlon = stats[i][m].lon-lines[i][j][k].lon, dlat = stats[i][m].lat-lines[i][j][k].lat;
    var dist = dlon*dlon+dlat*dlat;
    //if( Math.max(dlon,dlat) < 1 && Math.min(dlon,dlat) < 0.05 && ( lineIdx[i][m] == -1 /*|| lineIdx[i][m].j != j*/ ) )
    if( mindist > dist && ( !( i == 1 && m == 9 ) || ( i == 1 && m == 9 && lineIdx[1][3].j != j ) ) ) // 丸ノ内線の中野坂上での連結がめんどい…
    {
      mindist = dist;
      mij = j;
      mik = k;
      //++cnt;
      //break loop_end;
    }
  }
// 1 0 46
  statIdx[i][mij][mik] = m;
  lineIdx[i][m] = { i: i, j: mij, k: mik };
}

var statNameIdx = {};

for( var i = 0; i < 9; ++i ) for( var j = 0; j < stats[i].length; ++j )
  statNameIdx[stats[i][j].statName] = { i: i, j: j };

console.log(statNameIdx);

//console.log("dat update");

/*var str = "";
str += "[";
for( var i = 0; i < lines.length; ++i ) { 
  str += "[";
  for( var j = 0; j < lines[i].length; ++j ) {
    str += "[";
    for( var k = 0; k < lines[i][j].length; ++k ) {
      str += "{lat:" + lines[i][j][k][1] + ",lon:" + lines[i][j][k][0] + "}"
      str += k == lines[i][j].length-1 ? "" : ",";
    }
    str += "]";
    str += j == lines[i].length-1 ? "" : ",";
  }
  str += "]";
  str += i == lines.length-1 ? "" : ",";
}
str += "]";

console.log(str);*/

/*function toS( arr )
{
  var ret = "[";
  
  for( let i = 0; i < arr.length; ++i )
    ret += "{stat:" + arr[i].stat.toString() + ",k:" + arr[i].k.toString() + ",maxL:" + arr[i].maxL.toString() + ",mi:" + arr[i].mi.toString() + "}"+(i!=arr.length-1?",":"");

  ret += "]";

  return ret;
}*/

console.log( "Lon: min: " + minLon.toString() + " max: " + maxLon.toString() );
console.log( "Lat: min: " + minLat.toString() + " max: " + maxLat.toString() );

var s = "";
/*
s += "[";
for( let i = 0; i < 9; ++i )
{
  s += "[" + toS(statIdx[i][0]) + "," + toS(statIdx[i][1])+ "," + toS(statIdx[i][2])+ "," + toS(statIdx[i][3]) + "]" + (i!=8?",":"");
}
s += "]";*/
//console.log(s);

/*var maxAlt = 0;
for( let i = 0; i < 9; ++i ) for( let j = 0; j < stats[i].length; ++j )
{
  maxAlt = Math.max( maxAlt, stats[i][j][3] );
}*/

//console.log("maxAlt:"+maxAlt.toString());

//console.log(lines);

console.log("statIdx");
console.log(statIdx);
console.log("lineIdx");
console.log(lineIdx);
console.log("stats");
console.log(stats);
console.log("lines");
console.log(lines);

function Safe( arrS, arr, loopi, loopj, loopk, loopj2, loopp )
{
  if( loopi >= 0 && loopi < arr.length && loopj >= 0 && loopj < arr[loopi].length && loopk >= 0 && loopk < arr[loopi][loopj].length )
    return arr[loopi][loopj][loopk];
  else
  {
    console.log( arrS + ": i=" + loopi.toString() + ",j=" + loopj.toString() + ",k=" + loopk.toString() + ",j=" + loopj2.toString() + ",p=" + loopp.toString() );
    return 0;
  }
}

var q = Quaternion.defQ, toQ = Quaternion.rotXQ( Math.PI/2 );
var camZ = -1000, tocamZ = -1000;
var scale = 1, toScale = 1;

var trSelL = -1, trSelN = 0;
var trFl = true, stFl = true;

document.onkeydown = () => {
  if( event.keyCode == 32 )
    toQ = Quaternion.defQ;
  else if( event.keyCode == 90 )
    toScale = 4;
}

document.onkeyup = () => {
  if( event.keyCode == 32 )
    toQ = Quaternion.rotXQ( Math.PI/2 );
  else if( event.keyCode == 90 )
    toScale = 1;
  else if( event.keyCode == 38 && trSelL >= 0 )
    --trSelL, trSelN = 0;
  else if( event.keyCode == 40 && trSelL < 8 )
    ++trSelL, trSelN = 0;
  else if( event.keyCode == 37 && trSelL >= 0 && trSelN > 0 )
  {
    --trSelN;

    while( !trains[trSelL][trSelN].valid && trSelN > 0 )
      --trSelN;
  }
  else if( event.keyCode == 39 && trSelL >= 0 && trSelN < trains[trSelL].length-1 )
  {
    ++trSelN;

    while( !trains[trSelL][trSelN].valid && trSelN < trains[trSelL].length-1 )
      ++trSelN;
  }
  else if( event.keyCode == 16 )
    trFl ^= true;
  else if( event.keyCode == 13 )
    stFl ^= true;
}

var w, h;

/*function drawCuboid( xyz, d, sd, su, sn )
{
  var u = Quaternion.applyQ( d, Quaternion.rotQ( [0,0,1], Math.PI/2 ) );
  var n = [0,0,1];

  for( var j = 0; j < 3; ++j )
  {
    d[j] *= sd;
    u[j] *= su;
    n[j] *= sn;
  }

  var sgns = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  var vs = [];

  for( var j = 0; j < 8; ++j )
  {
    var v = [];
    for( var k = 0; k < 3; ++k )
      v.push( xyz[k]+sgns[j][0]*d[k]+sgns[j][1]*u[k]+sgns[j][2]*n[k] );

    vs.push(v);
  }

  var camXYZ = Quaternion.applyQ( [0,camZ,0], q ), nXYZ = Quaternion.applyQ( [0,0,1], q );

  for( var j = 0; j < 4; ++j )
  {
    if( j < 3 )
    {
      for( var k = 0; k < 1; ++k )
      {
        var xy1 = persp( vs[j+4*k], camXYZ[0], camXYZ[1], camXYZ[2], -camXYZ[0], -camXYZ[1], -camXYZ[2], nXYZ[0], nXYZ[1], nXYZ[2] ),
            xy2 = persp( vs[j+1+4*k], camXYZ[0], camXYZ[1], camXYZ[2], -camXYZ[0], -camXYZ[1], -camXYZ[2], nXYZ[0], nXYZ[1], nXYZ[2] );
        
        ctx.beginPath();
        ctx.moveTo( w/2-scale*xy1[1], h/2+scale*xy1[0] );
        ctx.lineTo( w/2-scale*xy2[1], h/2+scale*xy2[0] );
        ctx.closePath();
        ctx.stroke();
      }        
    }

    var xy1 = persp( vs[j], camXYZ[0], camXYZ[1], camXYZ[2], -camXYZ[0], -camXYZ[1], -camXYZ[2], nXYZ[0], nXYZ[1], nXYZ[2] ),
        xy2 = persp( vs[j+4], camXYZ[0], camXYZ[1], camXYZ[2], -camXYZ[0], -camXYZ[1], -camXYZ[2], nXYZ[0], nXYZ[1], nXYZ[2] );
    
    ctx.beginPath();
    ctx.moveTo( w/2-scale*xy1[1], h/2+scale*xy1[0] );
    ctx.lineTo( w/2-scale*xy2[1], h/2+scale*xy2[0] );
    ctx.closePath();
    ctx.stroke();
  }  
}*/

function tag2lIdx( tag, tag1, tag2 )
{
  //console.log(tag);
  //console.log(statTags[tag]);

  var l = -1, m = -1;
  for( var i = 0; i < lTags.length; ++i ) if( tag.indexOf( lTags[i].substr(13) ) != -1 || tag1.indexOf( lTags[i].substr(13) ) != -1 || tag2.indexOf( lTags[i].substr(13) ) != -1 )
    l = i;

  if( l == lTags.length-1 )
    l = 1;

  for( var j = 0; j < stats[l].length; ++j ) if( stats[l][j].statName == statTags[tag] )
    m = j;

  if( l == -1 || m == -1 )
    return {i: -1, j: -1, k: -1};

  return lineIdx[l][m];
}

function tag2lIdxT( tag, tag1, tag2 )
{
  //console.log(tag);
  //console.log(statTags[tag]);

  var l, m;
  for( var i = 0; i < lTags.length; ++i ) if( tag.indexOf( lTags[i].substr(13) ) != -1 || tag1.indexOf( lTags[i].substr(13) ) != -1 || tag2.indexOf( lTags[i].substr(13) ) != -1 )
    l = i;

  if( l == lTags.length-1 )
    l = 1;

  for( var j = 0; j < stats[l].length; ++j ) if( stats[l][j].statName == statTags[tag] )
    m = j;

  if( !lineIdx[l][m] )
    console.log(tag);

  return {i: l, j: m};
}

function calcXYZ( lon, lat, alt )
{ return [(lon-cLon)*10*w/2, (lat-cLat)*10*w/2, (alt/maxAlt-0.4)*300]; }

var prvAlt;

function calcXYZ_ijk( i, j, k )
{
  if( alts[i][j][k] != -1 )
    return alts[i][j][k];

  //var nx = (lines[i][j][k][0]-cLon)*10*w/2, ny = (lines[i][j][k][1]-cLat)*10*w/2;
  var p1 = k, p2 = k;

  while( statIdx[i][j][p1] == -1 && p1 > 0 )
    --p1;

  while( statIdx[i][j][p2] == -1 && p2 < statIdx[i][j].length-1 )
    ++p2;

  //if( p == -1 )
    //return [-1000000000,-1000000000,-1000000000];

  //console.log(p);
  //if( i == 0 )
    //console.log(i.toString()+","+j.toString()+","+p.toString());
  // 4,0,6 0,0,20 0,1,4
  //var nz = (stats[i][statIdx[i][j][p].stat][3]+(k-statIdx[i][j][p].k)/(statIdx[i][j][(p+1)%statIdx[i][j].length].k-statIdx[i][j][p].k)*(stats[i][statIdx[i][j][(p+1)%statIdx[i][j].length].stat][3]-stats[i][statIdx[i][j][p].stat][3]))/maxAlt*100;
  //(Safe("stats",stats,i,statIdx[i][j][p].stat,3,j,p)+(k-statIdx[i][j][p].k)/(statIdx[i][j][(p+1)%statIdx[i][j].length].k-statIdx[i][j][p].k)*(Safe("stats",stats,i,statIdx[i][j][(p+1)%statIdx[i][j].length].stat,3,j,(p+1)%statIdx[i][j].length)-Safe("stats",stats,i,statIdx[i][j][p].stat,3,j,p)))/maxAlt*100;
  //console.log([nx,ny,nz]);
  //var nz = i*30;
  /*if( i == 1 )
  {
    console.log(j.toString()+","+p.toString());
    console.log(stats[i][statIdx[i][j][p].stat][3]);
  }*/
  //console.log(stats[i][statIdx[i][j][(p+1)%statIdx[i][j].length][0]][3]);

  //if( i == 8 )
    //console.log(statIdx[i][j].length);

  //var distS = 0, maxDist = 0, dists = [], alt = 0;
  for( let m = 0; m < stats[i].length; ++m )
  {
    /*let dist = 1/Math.exp((stats[i][m][2]-lines[i][j][k][0])*(stats[i][m][2]-lines[i][j][k][0])+(stats[i][m][1]-lines[i][j][k][1])*(stats[i][m][1]-lines[i][j][k][1]));
    //console.log(dist);
    //if( dist < 0.015 )
    {
      //maxDist = Math.max( maxDist, dist );
      distS += dist;
      dists.push([dist,stats[i][m][3]]);
    }*/
  }

  //console.log(dists.length);

  //for( let l = 0; l < dists.length; ++l )
    //alt += dists[l][0]*dists[l][1]/distS;//(maxDist*dists.length-distS);

  if( statIdx[i][j][p1] == -1 )
    statIdx[i][j][p1] = statIdx[i][j][p2];

  if( statIdx[i][j][p2] == -1 )
    statIdx[i][j][p2] = statIdx[i][j][p1];

  if( statIdx[i][j][p1] == -1 && statIdx[i][j][p2] == -1 )
  {
    // 5 2 0 3
    // 4 2 0 16
    
    return alts[i][j][k] = calcXYZ(lines[i][j][k].lon,lines[i][j][k].lat,prvAlt);
  }

  var prvS = stats[i][statIdx[i][j][p1]], nxtS = stats[i][statIdx[i][j][p2]];

  //console.log("p1: "+p1.toString());
  //console.log("p2: "+p2.toString());
  //console.log(statIdx[i][j][p1]);
  //console.log(statIdx[i][j][p2]);

  if( !prvS || !nxtS )
  {
    /*console.log(i);
    console.log(j);
    console.log("p1: "+p1.toString());
    console.log("p2: "+p2.toString());*/
    //console.log(statIdx[i][j][p2]);
  }

  prvAlt = p1!=p2?prvS.alt+(nxtS.alt-prvS.alt)*(k-p1)/(p2-p1):prvS.alt;

  return alts[i][j][k] = calcXYZ(lines[i][j][k].lon,lines[i][j][k].lat,prvAlt);//(i-4)*30 0);(stats[i][statIdx[i][j][p].stat].alt+(k-statIdx[i][j][p].k)/(statIdx[i][j][(p+1)%statIdx[i][j].length].k-statIdx[i][j][p].k)*(stats[i][statIdx[i][j][(p+1)%statIdx[i][j].length].stat].alt-stats[i][statIdx[i][j][p].stat].alt)));//(Safe("stats",stats,i,statIdx[i][j][p].stat,3,j,p)+(k-statIdx[i][j][p].k)/(statIdx[i][j][(p+1)%statIdx[i][j].length].k-statIdx[i][j][p].k)*(Safe("stats",stats,i,statIdx[i][j][(p+1)%statIdx[i][j].length].stat,3,j,(p+1)%statIdx[i][j].length)-Safe("stats",stats,i,statIdx[i][j][p].stat,3,j,p))));
}

function Plerp( i, j, k )
{
  var fk = Math.floor(k);

  if( fk < 0 || fk >= statIdx[i][j].length )
    return [0,0,0];

  var fXYZ = calcXYZ_ijk(i,j,fk), tXYZ = calcXYZ_ijk(i,j,fk+1 < statIdx[i][j].length-1 ? fk+1 : fk);
  var ret = [];

  for( var l = 0; l < 3; ++l )
    ret.push( (fk+1-k)*fXYZ[l]+(k-fk)*tXYZ[l] );

  return ret;
}

function multilineText(context, text, width) {
  var len = text.length; 
  var strArray = [];
  var tmp = "";
  var i = 0;

  if( len < 1 ){
      //textの文字数が0だったら終わり
      return strArray;
  }

  for( i = 0; i < len; i++ ){
      var c = text.charAt(i);  //textから１文字抽出
      if( c == "\n" ){
          /* 改行コードの場合はそれまでの文字列を配列にセット */
          strArray.push( tmp );
          tmp = "";

          continue;
      }

      /* contextの現在のフォントスタイルで描画したときの長さを取得 */
      if (context.measureText( tmp + c ).width <= width){
          /* 指定幅を超えるまでは文字列を繋げていく */
          tmp += c;
      }else{
          /* 超えたら、それまでの文字列を配列にセット */
          strArray.push( tmp );
          tmp = c;
      }
  }

  /* 繋げたままの分があれば回収 */
  if( tmp.length > 0 )
      strArray.push( tmp );

  return strArray;
}

var upd = false;

function render()
{
  w = cvs.width, h = cvs.height;

  ctx.fillStyle = "rgb(40,40,40)";
  ctx.fillRect( 0, 0, w, h );

  ctx.fillStyle = "rgb(255,255,255)";
  ctx.font = "normal 40px 'Yu Gothic'";
  ctx.fillText( tim.toString(), 20, 60 );
  if( upd )
    ctx.fillText( "Updating...", 20, 120 );

// var sNameIdx = statNameIdx[statTags[tag]];
//  var lIdx = lineIdx[sNameIdx.i][sNameIdx.j];

  if( trFl && trSelL >= 0 && trains[trSelL].length )
  {
    ctx.font = "normal 15px 'Ricty Diminished'";
    var dTr = trains[trSelL][trSelN], iY = upd ? 160 : 100;
    ctx.fillText( "num: "+dTr.num, 20, iY ); iY += 20;
    ctx.fillText( "type: "+dTr.type, 20, iY ); iY += 20;
    ctx.fillText( "rail: "+dTr.rail, 20, iY ); iY += 20;
    ctx.fillText( "sStat: "+dTr.sStat, 20, iY ); iY += 20;
    ctx.fillText( "tStat: "+dTr.tStat, 20, iY ); iY += 20;
    ctx.fillText( "fStat: "+dTr.fStat, 20, iY ); iY += 20;
    ctx.fillText( "dir: "+dTr.dir, 20, iY ); iY += 20;
    ctx.fillText( "k: "+dTr.k, 20, iY ); iY += 20;
    ctx.fillText( "tok: "+dTr.tok, 20, iY ); iY += 20;
    ctx.fillText( "pos: "+dTr.pos.toString(), 20, iY ); iY += 20;
    ctx.fillText( "statTags: "+statTags[dTr.fStat], 20, iY ); iY += 20;
    var lIT = tag2lIdxT( dTr.fStat, dTr.sStat, dTr.tStat );
    ctx.fillText( "lIdx: {i: "+lIT.i+", j: "+lIT.j+"}", 20, iY ); iY += 20;
    var lI = tag2lIdx( dTr.fStat, dTr.sStat, dTr.tStat );
    ctx.fillText( "lIdx: {i: "+lI.i+", j: "+lI.j+", k: "+lI.k+"}", 20, iY ); iY += 20;
    var trN = trNames[dTr.num.substr(0,5)+dTr.rail];
    ctx.fillText( "trNames: {i: "+trN.i+", j: "+trN.j+"}", 20, iY ); iY += 20;
    /*var arrS = multilineText( ctx, dTr.json, 600 );

    for( var k = 0; k < arrS.length; ++k )
      ctx.fillText( (k==0?"json: ":"")+arrS[k], 20, iY ), iY += 20;*/
  }

  if( tim == 0 )
  {
    upd = true;

    loopSleep( lTags.length, 1000, i => {
      var xhr = new XMLHttpRequest();
      xhr.open( "GET", "https://api.tokyometroapp.jp/api/v2/datapoints?rdf:type=odpt:Train&odpt:railway="+lTags[i]+"&acl:consumerKey=cc66ea238085a6851d9efac3ab639b4313b14d1d8f0684bc53bbac3207be0239", true );
      xhr.onload = ev => {
        var res = xhr.response;
        var root = JSON.parse( res );

        for( var j = 0; j < root.length; ++j )
        {
          var l;
          
          for( var k = 0; k < lTags.length; ++k )
            if( root[j]['odpt:fromStation'].indexOf( lTags[k].substr(13) ) != -1 )
              l = k;

          if( l == lTags.length-1 )
            l = 1;

          var trNum = root[j]['odpt:trainNumber'], trRail = root[j]['odpt:railway'];

          if( !trNames.hasOwnProperty( trNum.substr(0,5)+trRail ) )
          {
            trains[l].push( {num: trNum, type: root[j]['odpt:trainType'], rail: trRail, sStat: root[j]['odpt:startingStation'], tStat: root[j]['odpt:terminalStation'], fStat: root[j]['odpt:fromStation'], dir: root[j]['odpt:railDirection'], k: tag2lIdx( root[j]['odpt:fromStation'], root[j]['odpt:startingStation'], root[j]['odpt:terminalStation'] ).k, tok: tag2lIdx( root[j]['odpt:fromStation'], root[j]['odpt:startingStation'], root[j]['odpt:terminalStation'] ).k, json: res, lat: true, valid: true } );
            trNames[trNum.substr(0,5)+trRail] = { i: l, j: trains[l].length-1 };
            console.log(trains[l][trains[l].length-1]);
          }
          else
          {
            var tarTr = trains[trNames[trNum.substr(0,5)+trRail].i][trNames[trNum.substr(0,5)+trRail].j];
            tarTr.num = trNum;
            tarTr.type = root[j]['odpt:trainType'];
            tarTr.rail = trRail;
            tarTr.sStat = root[j]['odpt:startingStation'];
            tarTr.tStat = root[j]['odpt:terminalStation'];
            tarTr.fStat = root[j]['odpt:fromStation'];
            tarTr.dir = root[j]['odpt:railDirection'];
            tarTr.tok = tag2lIdx( root[j]['odpt:fromStation'], root[j]['odpt:startingStation'], root[j]['odpt:terminalStation'] ).k;
            tarTr.json = res;
            tarTr.lat = true;
          }
        }

        if( root.length == 0 )
          trains[i] = [];

        for( var k = 0; k < trains[i].length; ++k ) if( !trains[i][k].lat )
            trains[i][k].valid = false;

        if( i == lTags.length-1 )
        {
          console.log("trains");
          console.log(trains);

          upd = false;
        }
      };
      xhr.onerror = e => {
        console.error(xhr.statusText);
      };
      xhr.send(null);
    } );
  }



  tim = (tim+1) % 1800;
  /*for( let i = 0; i < 4; ++i )
  {
    var camZ = 5;
    var xy1 = persp( vs[i], camZ*Math.cos(tim/40), camZ*Math.sin(tim/40), 0, -camZ*Math.cos(tim/40), -camZ*Math.sin(tim/40), 0, 0, 0, 1 ),
        xy2 = persp( vs[(i+1)%4], camZ*Math.cos(tim/40), camZ*Math.sin(tim/40), 0, -camZ*Math.cos(tim/40), -camZ*Math.sin(tim/40), 0, 0, 0, 1 );

    ctx.beginPath();
    ctx.moveTo( w/2+200*xy1[1], h/2+200*xy1[0] );
    ctx.lineTo( w/2+200*xy2[1], h/2+200*xy2[0] );
    ctx.stroke();

    xy1 = persp( vs[i+4], camZ*Math.cos(tim/40), camZ*Math.sin(tim/40), 0, -camZ*Math.cos(tim/40), -camZ*Math.sin(tim/40), 0, 0, 0, 1 ),
    xy2 = persp( vs[(i+1)%4+4], camZ*Math.cos(tim/40), camZ*Math.sin(tim/40), 0, -camZ*Math.cos(tim/40), -camZ*Math.sin(tim/40), 0, 0, 0, 1 );

    ctx.beginPath();
    ctx.moveTo( w/2+200*xy1[1], h/2+200*xy1[0] );
    ctx.lineTo( w/2+200*xy2[1], h/2+200*xy2[0] );
    ctx.stroke();    

    xy1 = persp( vs[i], camZ*Math.cos(tim/40), camZ*Math.sin(tim/40), 0, -camZ*Math.cos(tim/40), -camZ*Math.sin(tim/40), 0, 0, 0, 1 ),
    xy2 = persp( vs[i+4], camZ*Math.cos(tim/40), camZ*Math.sin(tim/40), 0, -camZ*Math.cos(tim/40), -camZ*Math.sin(tim/40), 0, 0, 0, 1 );

    ctx.beginPath();
    ctx.moveTo( w/2+200*xy1[1], h/2+200*xy1[0] );
    ctx.lineTo( w/2+200*xy2[1], h/2+200*xy2[0] );
    ctx.stroke();
  }*/

  q = Quaternion.qSlerp( q, toQ, 0.1 );
  //camZ = morph( camZ, tocamZ, 10 );
  scale = morph( scale, toScale, 10 );

  for( let i = 0; i < 9; ++i )
  {
    for( let j = 0; j < lines[i].length; ++j ) for( let k = 0; k < lines[i][j].length-1; ++k )
    {
      var camXYZ = Quaternion.applyQ( [0,camZ,0], q ), nXYZ = Quaternion.applyQ( [0,0,1], q );
      
      var xy1 = persp( Plerp(i,j,k), camXYZ[0], camXYZ[1], camXYZ[2], -camXYZ[0], -camXYZ[1], -camXYZ[2], nXYZ[0], nXYZ[1], nXYZ[2] /*0, 0, -1000, 0, 0, 1000, 0, 1, 0*/ ),
          xy2 = persp( Plerp(i,j,k+1), camXYZ[0], camXYZ[1], camXYZ[2], -camXYZ[0], -camXYZ[1], -camXYZ[2], nXYZ[0], nXYZ[1], nXYZ[2] /*0, 0, -1000, 0, 0, 1000, 0, 1, 0*/ );
      
      if( xy1[2] < -0.1 || xy2[2] < -0.1 )
        continue;

      var red = parseInt( lCols[i].substring(1,3), 16 );
      var green = parseInt( lCols[i].substring(3,5), 16 );
      var blue = parseInt( lCols[i].substring(5,7), 16 );

      ctx.beginPath();
      ctx.strokeStyle = "rgba("+red.toString()+","+green.toString()+","+blue.toString()+","+(trSelL==-1||trSelL==i?"1.0":"0.1")+")";
      ctx.lineWidth = 2;
      ctx.moveTo( w/2-scale*xy1[1], h/2+scale*xy1[0] );
      ctx.lineTo( w/2-scale*xy2[1], h/2+scale*xy2[0] );
      ctx.closePath();
      ctx.stroke(); 
    }
  }

  for( let i = 0; i < 9; ++i ) for( let j = 0; j < stats[i].length; ++j )
  {
    var xy = persp( calcXYZ(stats[i][j].lon,stats[i][j].lat,stats[i][j].alt/*0/*(i-4)*30*/), camXYZ[0], camXYZ[1], camXYZ[2], -camXYZ[0], -camXYZ[1], -camXYZ[2], nXYZ[0], nXYZ[1], nXYZ[2] /*0, 0, -1000, 0, 0, 1000, 0, 1, 0*/ );
        
    if( xy < -0.1 )
      continue;

    var red = parseInt( lCols[i].substring(1,3), 16 );
    var green = parseInt( lCols[i].substring(3,5), 16 );
    var blue = parseInt( lCols[i].substring(5,7), 16 );

    ctx.beginPath();
    ctx.fillStyle = "rgba("+red.toString()+","+green.toString()+","+blue.toString()+",0.1)";
    ctx.arc( w/2-scale*xy[1], h/2+scale*xy[0], 6, 0, 2*Math.PI, true );
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "rgba("+red.toString()+","+green.toString()+","+blue.toString()+",1.0)";
    ctx.arc( w/2-scale*xy[1], h/2+scale*xy[0], 3, 0, 2*Math.PI, true );
    ctx.closePath();
    ctx.fill();
    if( stFl )
    {
      ctx.font = "normal 10px 'Yu Gothic'";
      ctx.fillText( stats[i][j].statName, w/2-scale*xy[1]-5, h/2+scale*xy[0]-11 );
    }
  }

  //console.log(trains.length);

  if( trFl ) for( var i = 0; i < trains.length; ++i ) for( var j = 0; j < trains[i].length; ++j )
  {
    var tr = trains[i][j];

    if( !tr.valid )
      continue;

    //if( !statTags.hasOwnProperty( tr.fStat ) || !statTags.hasOwnProperty( tr.tStat ) )
      //continue;

    var curlIdx = tag2lIdx( tr.fStat, tr.sStat, tr.tStat ), tk = tag2lIdx( tr.tStat, tr.fStat, tr.sStat ).k, sk = tag2lIdx( tr.sStat, tr.fStat, tr.tStat ).k;
    var curXYZ = Plerp( curlIdx.i, curlIdx.j, tr.k );
    if( ( tk != -1 && curlIdx.k < tk ) || ( sk != -1 && curlIdx.k > sk ) )
      tr.pos = true;
    else
      tr.pos = false;

    if( !upd )
      tr.lat = false;

    //if( tim % 100 == 0 )
    {
      var nk = tr.tok+(tr.pos?0.005:-0.005);
      if( nk < 0 )
        nk = 0;
      if( nk > lines[curlIdx.i][curlIdx.j].length-1 )
        nk = lines[curlIdx.i][curlIdx.j].length-1;

      tr.tok = nk;
    }

    tr.k = morph( tr.k, tr.tok, 10 );

    /*var toXYZ = calcXYZ_ijk( curlIdx.i, curlIdx.j, nk );
    var norm = Math.sqrt((toXYZ[0]-curXYZ[0])*(toXYZ[0]-curXYZ[0])+(toXYZ[1]-curXYZ[1])*(toXYZ[1]-curXYZ[1])+(toXYZ[2]-curXYZ[2])*(toXYZ[2]-curXYZ[2]));
    */
    var xy = persp( curXYZ, camXYZ[0], camXYZ[1], camXYZ[2], -camXYZ[0], -camXYZ[1], -camXYZ[2], nXYZ[0], nXYZ[1], nXYZ[2] /*0, 0, -1000, 0, 0, 1000, 0, 1, 0*/ );
        
    if( xy < -0.1 )
      continue;

    // "rgba(229,107,45,0.5)"
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,"+(trSelL==-1||i==trSelL&&j==trSelN?"0.6":"0.1")+")";
    ctx.arc( w/2-scale*xy[1], h/2+scale*xy[0], 9, 0, 2*Math.PI, true );
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,"+(trSelL==-1||i==trSelL&&j==trSelN?"1.0":"0.1")+")";
    ctx.arc( w/2-scale*xy[1], h/2+scale*xy[0], 3, 0, 2*Math.PI, true );
    ctx.closePath();
    ctx.fill();

    ctx.font = "normal 10px 'Yu Gothic'";
    ctx.fillText( (tr.pos?"-> ":"<- ")+tr.num, w/2-scale*xy[1]-5, h/2+scale*xy[0]-11 );

    //ctx.strokeStyle = "rgb(40,40,40)";
    //drawCuboid( curXYZ, [(toXYZ[0]-curXYZ[0])/norm, (toXYZ[1]-curXYZ[1])/norm, (toXYZ[2]-curXYZ[2])/norm], 10, 5, 5 );
  }
}
//render();
setInterval( render, 1000/60 );