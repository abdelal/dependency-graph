export const initDefinitions = (svg) =>
    svg.append('defs')
    .append('marker')
    .attrs({
        'id': 'arrowhead',
        'viewBox': '-0 -5 10 10',
        'refX': 34,
        'refY': 0,
        'orient': 'auto',
        'markerWidth': 8,
        'markerHeight': 8,
        'xoverflow': 'visible'
    })
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#999')
    .style('stroke', 'none');