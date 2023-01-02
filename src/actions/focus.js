// <input use:focus />
// <input use:focus={isFocused} />

export default function focus(node, flag = true) {
    flag && node.focus && node.focus();

    return {
        update(flag) {
            flag && node.focus && node.focus();
            // Should we call node.blur() if flag is false?
            // flag || (node.blur && node.blur());
        },
    };
}
