// <div use:mount={node => console.log('Mounting:', node.tagName)}></div>

export default function mount(node, handler) {
    handler(node);
}
