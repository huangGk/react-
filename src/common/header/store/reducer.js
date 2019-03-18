import { fromJS } from 'immutable';
import * as constants from './constants';
const defaultState = fromJS({
  carPanelData: [],
  cartShow: false,
  maxOff: false
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.delcarPanel:
      let carPanel = state.get('carPanelData').toJS();
      return state.set(
        'carPanelData',
        fromJS(carPanel.filter(item => item.sku_id !== action.sku_id))
      );
    case constants.addcarPanel:
      action.data = action.data.toJS();
      let data = state.get('carPanelData').toJS();
      let isFirst = true;
      let ismaxOff = false;
      data.forEach(goods => {
        if (goods.sku_id === action.data.sku_id) {
          goods.count += action.data.count;
          isFirst = false;
          if (goods.count > goods.limit_num) {
            // 如果商品的件数大于商品的最大购买数，弹出一个框，告诉用户购买上限
            goods.count -= action.data.count;
            ismaxOff = true;
          }
        }
      });
      if (isFirst) {
        data.push(action.data);
        return state.merge({
          carPanelData: fromJS(data),
          cartShow: true
        });
      }
      return state.merge({
        carPanelData: fromJS(data),
        cartShow: true,
        maxOff: ismaxOff
      });
    case constants.showCarHandle:
      return state.set('cartShow', true);
    case constants.hideCarHandle:
      return state.set('cartShow', false);
    case constants.closeDialog:
      return state.set('maxOff', false);
    case constants.subCarPanel: // 减少商品数量
      let subRes = state
        .get('carPanelData')
        .toJS()
        .map(item => {
          if (item.sku_id === action.sku_id) {
            if (item.count <= 1) {
              return item;
            }
            item.count--;
          }
          return item;
        });
      return state.set('carPanelData', fromJS(subRes));
    case constants.plusCarPanelData: // 添加商品数量
      let plus = state
        .get('carPanelData')
        .toJS()
        .map(item => {
          if (item.sku_id === action.sku_id) {
            if (item.count >= item.limit_num) {
              return item;
            }
            item.count++;
          }
          return item;
        });
      return state.set('carPanelData', fromJS(plus));
    case constants.checkItem: // 切换商品选中状态
      let temp = state.get('carPanelData').toJS()
      temp.forEach(item => {
        if (item.sku_id === action.sku_id) {
          item.checked = !item.checked
        }
      })
      return state.set('carPanelData', fromJS(temp));
    
    default:
      return state;
  }
};
