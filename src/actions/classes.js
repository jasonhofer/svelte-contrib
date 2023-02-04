import clsx from 'clsx';

/**
 * Usage:
 *
 *     <div use:classes={['cursor-pointer mb-3', isCentered && 'text-center', {active: isActive}]}></div>
 *
 * @param {HTMLElement} node
 * @param {*} props
 * @returns {Object}
 */
export default function classes(node, props) {
	let previouslyAdded = [];
	const update = props => {
    const adding = clsx(props)
      .split(' ').filter(s => s);
    const removing = previouslyAdded
      .filter(
        s => !adding.includes(s)
      );
    removing.length && node.classList.remove(...removing);
    adding.length && node.classList.add(...adding);
        previouslyAdded = adding;
	};

  update(props);

	return { update };
}