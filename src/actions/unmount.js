// <div use:unmount={node => console.log('Unmounting:', node.tagName)}></div>

export default function unmount(node, handler) {
    return {
        destroy() {
            handler(node);
        },
    };
}
