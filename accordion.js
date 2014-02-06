/* SETTINGS */
	// Animation
	var FRAME_PX = 20; 
	var FRAME_DELAY = 0;
	var MIN_GROUP_HEIGHT = "20px";
	// Highlighting
	var rowNormal = "#ffffff";
	var rowHighlight = "#ffffff";
	// Added to get script to work (Arleigh)
	var ABS_MIN = 20;


//Create empty-vars
var groupNames = new Array();
var dispStatus2 = new Array();
var g, notAllDisp, c, a, dispStatus, imgDisp, gHeight, oHighlightedFeature;

// Shortcut getID function
function $_(ee) {
	return document.getElementById(ee);
}

// Modifier for innerHTML
function setHtml(elmId, strContent) {
	$_( elmId ).innerHTML = strContent;
}

// Opens / Closes individual groups
function toggleGroup(gId,startHeight) {
	g = $_(gId);
	ABS_MIN = startHeight;
	notAllDisp = false;
	c = 0;
	if (g.style.height == '') g.style.height = MIN_GROUP_HEIGHT;
	
	//closes 'dhtmlPop' layer [when open]
	hideDhtmlPop('dhtmlPop');
	
	if (g.style.height == ABS_MIN + 'px') {
		_animateGroup(g,ABS_MIN,g.scrollHeight,FRAME_PX);
		$_(gId + '_img').src = cImgSrc;
		$_(gId + '_img').alt = cDesc;	
	}
	else {
		_animateGroup(g,g.scrollHeight,ABS_MIN,-FRAME_PX);
		$_(gId + '_img').src = eImgSrc;
		$_(gId + '_img').alt = eDesc;
	}
	
	for (a=0; a < groupNames.length; a++) {
		dispStatus = $_(groupNames[a]).style.height;
		if (dispStatus == ''){
			dispStatus = MIN_GROUP_HEIGHT;
		}
		if (dispStatus == MIN_GROUP_HEIGHT){
			c++;
		}
	}
	
	if (c == 0){
		notAllDisp = false;
	}else{
		notAllDisp = true;
	}
	
	_toggleHTMLSwitch(notAllDisp);
}


// Opens / Closes all groups
function toggleAll() {
	notAllDisp = false;
	for (a=0; a < groupNames.length; a++) {
		dispStatus = $_(groupNames[a]).style.height;
		if (dispStatus == '') dispStatus = MIN_GROUP_HEIGHT;
		if (dispStatus == MIN_GROUP_HEIGHT) {
			notAllDisp = true;
			break;
		}		
	}
	if (notAllDisp == true) {
		_openCloseGroups(groupNames,false);
		_toggleHTMLSwitch(false);

	}
	else {
		_openCloseGroups(groupNames,true);
		_toggleHTMLSwitch(true);
	}
	hideDhtmlPop('dhtmlPop');
}

// Add group id-name to 'groupNames' array
function addGroup(groupID) {
	groupNames.push(groupID);
}


// Show Feature
function highlightFeature(select) {
	var fVal = select.value;
	var featureID;
	var oFeat;
	//de-highlight cells
	for( var i=0; i < select.options.length; i++ ){
		featureID = select.options[i].value;
		oFeat = $_('feat_' + featureID);
		if( oFeat != null ){
			if( featureID == fVal ){
				oFeat.style.backgroundColor = rowHighlight;
				oHighlightedFeature = oFeat;
			}else{
				oFeat.style.backgroundColor = rowNormal;
			}
		}
	}
	//closes 'dhtmlPop' layer [when open]
	hideDhtmlPop('dhtmlPop');

	var thenTrigger=(fVal!=-1)?_highlightAndOpenFeature:_delayedToggleGroupMechanical;
	//close all groups when Feature selected
	_openCloseGroups(groupNames,true,thenTrigger);
	_toggleHTMLSwitch(true);
}


// Expand Specification Group
function expandCategory() {
	var URIarg = location.search.substr(1).split('?').toString();

	//otherwise, verify uri includes argument, argument-name is valid and argument-value is not blank and is numeric
	if (URIarg != "" && URIarg.split('=')[0] == "expandCategory" && URIarg.split('=')[1] != "" && !isNaN(URIarg.split('=')[1])) {
		eval('toggleGroup("accordionGroup_' + URIarg.split('=')[1] + '",' + parseInt(MIN_GROUP_HEIGHT) + ')');
	}
	//otherwise, open default-group
	else {
		toggleGroup("accordionGroup_fa1",parseInt(MIN_GROUP_HEIGHT));
	}
}

/* ########################### INTERNAL FUCNTIONS ########################### */

function _animateGroup(g,minH,maxH,delta,thenTrigger) {
	if (delta > 0) {
		if(minH <= maxH) {
			g.style.height = minH + "px";
			setTimeout(function () { _animateGroup(g,(minH+delta),maxH,delta,thenTrigger); }, FRAME_DELAY);
		eAllLink
			g.style.height = g.scrollHeight + "px";
			if(typeof thenTrigger=="function"){thenTrigger()}
			return;
		}
	}else{
		if(minH >= ABS_MIN) {
			g.style.height = minH + "px";
			setTimeout(function () { _animateGroup(g,(minH+delta),maxH,delta,thenTrigger); }, FRAME_DELAY);
		}else{
			g.style.height = ABS_MIN + "px";
			if(typeof thenTrigger=="function"){thenTrigger()}
			return;
		}
	}
}

function _toggleHTMLSwitch(collapsed) {
	if (collapsed == true) {
		setHtml("ExpandCollapseLink_Top",eAllLink);
		setHtml("ExpandCollapseLink_Bottom",eAllLink);
	}
	else {
		setHtml("ExpandCollapseLink_Top",cAllLink);
		setHtml("ExpandCollapseLink_Bottom",cAllLink);
	}
}

function _openCloseGroups(items,allOpened,thenTrigger) {
	var wasTriggered=false
	if(allOpened == false) {
		imgDisp = cImgSrc; 
		for (a=0; a < items.length; a++) {
			g = $_(items[a]);
			gHeight = $_(items[a]).style.height;
			if (gHeight == "") gHeight = MIN_GROUP_HEIGHT;
			if (gHeight == MIN_GROUP_HEIGHT){
				_animateGroup(g,parseInt(MIN_GROUP_HEIGHT),g.scrollHeight,FRAME_PX,thenTrigger);
				wasTriggered=true
			} 
			$_(items[a] + "_img").src = imgDisp;	
		}
	}else{
		imgDisp = eImgSrc; 
		for (a=0; a < items.length; a++) {
			g = $_(items[a]);
			gHeight = $_(items[a]).style.height;
			if (parseInt(gHeight) > parseInt(MIN_GROUP_HEIGHT)){
				_animateGroup(g,g.scrollHeight,parseInt(MIN_GROUP_HEIGHT),-FRAME_PX,thenTrigger);
				wasTriggered=true
			}
			$_(items[a] + "_img").src = imgDisp;	
		}
	}
	if(!wasTriggered && typeof thenTrigger=="function"){thenTrigger()}
}

function _thenScrollIntoView(){
	if(newScrollAnchor){
		$_(newScrollAnchor).scrollIntoView() //-
		newScrollAnchor=null
	}
}
// Highlight & Open A Standard Feature
function _highlightAndOpenFeature() {
	var oFeat = oHighlightedFeature;
	var oParent = oFeat.parentNode;
	var bDone = false;
	var id;
	while( !bDone ){
		id = oParent.id
		if( id.indexOf('accordionGroup_') > -1 ){
			bDone = true;
		}else{
			oParent = oParent.parentNode;
		}
		if( oParent.nodeName == 'BODY' ){
			bDone = true;
		}
	}
	
	newScrollAnchor = oFeat.id;
	
	if (oParent && (oParent.style.height == MIN_GROUP_HEIGHT || oParent.style.height == '')) {
		_animateGroup(oParent,parseInt(MIN_GROUP_HEIGHT),oParent.scrollHeight,FRAME_PX,_thenScrollIntoView);
		$_(oParent.id + '_img').src = cImgSrc;
		$_(oParent.id + '_img').alt = cDesc;
	}
}

// Delayed Group1 Accordion-activator
function _delayedToggleGroupMechanical() {
	toggleGroup('accordionGroup_mechanical',parseInt(MIN_GROUP_HEIGHT));
}