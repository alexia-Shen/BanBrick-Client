const initSystem = {
    activeRoute: ''
};

export function reducer() {
    return (state = Object.assign({}, initSystem), action) => {
        switch (action.type) {
            case 'UPDATE_ACTIVEROUTE':
                return Object.assign({}, {activeRoute: action.payload});
            default:
                return state;
        }
    };
}
export const systemReducer = reducer();

