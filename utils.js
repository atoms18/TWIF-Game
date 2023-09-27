
class Utils {
  static rectCircleOverlap(r, c) {
    let cx = Math.abs(c.x - r.x - r.halfWidth);
    let xDist = r.halfWidth + c.radius;
    if (cx > xDist) { return false; }
    let cy = Math.abs(c.y - r.y - r.halfHeight);
    let yDist = r.halfHeight + c.radius;
    if (cy > yDist) { return false; }
    if (cy <= r.halfHeight) { return 1; } // X-axis
    if (cx <= r.halfWidth) { return 2; } // Y-axis
    let xCornerDist = cx - r.halfWidth;
    let yCornerDist = cy - r.halfHeight;
    let xCornerDistSq = xCornerDist * xCornerDist;
    let yCornerDistSq = yCornerDist * yCornerDist;
    let maxCornerDistSq = c.radius * c.radius;
    return xCornerDistSq + yCornerDistSq <= maxCornerDistSq;
  }

  static pointInRectangle(x, y, rect) {
    return rect.x <= x && x <= rect.x + rect.width &&
           rect.y <= y && y <= rect.y + rect.height;
  }
  
  static floodFillScanline(x, y, width, height, test, paint) {
	if(x > total_space_over_map[0]-1) {
		x = total_space_over_map[0]-1;
	}
	
	if(y > total_space_over_map[0]-1) {
		y = total_space_over_map[0]-1;
	}
	
	// xMin, xMax, y, down[true] / up[false], extendLeft, extendRight
	var space_with_no_area = [];
	
	var ranges = [[x, x, y, null, true, true]];
	paint(x, y, space_with_no_area);

	while(ranges.length) {
		var r = ranges.pop();
		var down = r[3] === true;
		var up =   r[3] === false;

		// extendLeft
		var minX = r[0];
		var y = r[2];
		if(r[4]) {
			while(minX>0 && test(minX-1, y)) {
				minX--;
				paint(minX, y, space_with_no_area);
			}
		}
		var maxX = r[1];
		// extendRight
		if(r[5]) {
			while(maxX<width-1 && test(maxX+1, y)) {
				maxX++;
				paint(maxX, y, space_with_no_area);
			}
		}
		
		r[0]--;
		r[1]++;

		var addNextLine = (newY, isNext, downwards) => {
			var rMinX = minX;
			var inRange = false;
			for(var x=minX; x<=maxX; x++) {
				// skip testing, if testing previous line within previous range
				var empty = (isNext || (x<r[0] || x>r[1])) && test(x, newY);
				if(!inRange && empty) {
					rMinX = x;
					inRange = true;
				}
				else if(inRange && !empty) {
					ranges.push([rMinX, x-1, newY, downwards, rMinX==minX, false]);
					inRange = false;
				}
				if(inRange) {
					paint(x, newY, space_with_no_area);
				}
				// skip
				if(!isNext && x==r[0]) {
					x = r[1];
				}
			}
			if(inRange) {
				ranges.push([rMinX, x-1, newY, downwards, rMinX==minX, true]);
			}
		}

		if(y<height)
			addNextLine(y+1, !up, true);
		if(y>0)
			addNextLine(y-1, !down, false);
	}

	for(let pos of space_with_no_area) {
		let pos_split = pos.split(",");
		main_map.space[pos_split[0]][pos_split[1]].floodfill_checked = false;
	}
	return space_with_no_area;
  }
}
