import { pipe } from '../fp/core';

const SELF_CONTAINED_TAGS = [
    '!doctype',
    'meta',
    'img',
    'br',
    'hr',
    '!--',
    '!--pseudoExchange--',
];

export const getTagName = (s: string): string => s.split('>')[0].split(' ')[0];

const getInnerText = (s: string): string => {
    const parts = s.split('>');
    return !parts.length ? '' : parts[1];
};

type IHtmlTree = {
    tagName: string;
    children: Array<IHtmlTree>;
    value?: string;
};

export default class HtmlTree {
    _tree: IHtmlTree;

    // this is specific to the tree construction
    static getSubTree(tree: IHtmlTree, path: string[]) {
        const currentPath = [...path];
        let currentTree = tree;
        while (currentPath.length) {
            const nextPath = <string>currentPath.shift();
            for (let i = currentTree.children.length - 1; i >= 0; i -= 1) {
                if (currentTree.children[i].tagName === nextPath) {
                    currentTree = currentTree.children[i];
                    break;
                }
            }
        }
        return currentTree;
    }

    static getNode(
        tree: IHtmlTree,
        path: Array<{ tagName: string; nth: number }>,
    ) {
        const currentPath = [...path];
        let currentTree = tree;
        while (currentPath.length) {
            const nextPath = currentPath.shift();
            if (nextPath) {
                currentTree = currentTree.children.filter(
                    (n) => n.tagName === nextPath.tagName,
                )[nextPath.nth];
            }
        }
        return currentTree;
    }

    static of(i: string) {
        return new HtmlTree(this.parseInput(i));
    }

    static parseInput(i: string) {
        return i;
    }

    constructor(i: string) {
        const j = pipe(
            (i: string) => i.split('<'),
            (i: string[]) => i.slice(1, Infinity),
            (i: string[]) => i.map((j) => j.trim()),
        )(i);

        const { tree } = j.reduce(
            (acc, el) => {
                const { tree, path } = acc;

                const value = getInnerText(el);

                if (el[0] !== '/') {
                    const tagName = getTagName(el);
                    const currentTree = HtmlTree.getSubTree(tree, path);

                    currentTree.children.push({
                        tagName,
                        children: [],
                        ...(value ? { value } : {}),
                    });

                    if (!SELF_CONTAINED_TAGS.includes(tagName)) {
                        path.push(tagName);
                    }
                } else {
                    path.pop();
                    if (value) {
                        const currentTree = HtmlTree.getSubTree(tree, path);
                        currentTree.value = `currentTree.value ${value}`;
                    }
                }

                return { tree, path };
            },
            {
                tree: <IHtmlTree>{ tagName: '', children: [] },
                path: <string[]>[],
            },
        );

        this._tree = tree;
    }

    get tree() {
        return this._tree;
    }
}
