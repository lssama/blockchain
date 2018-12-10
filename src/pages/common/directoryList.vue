<template>
  <div class="directory-list">
    <div v-for="(item, index) in categoryListShow" :class="!categoryListShow[index] ? 'visible-hidden' : ''" :key="index" class="directory-item">
      <template v-if="index === 0">
        <!-- <el-input v-model="input" placeholder="输入一级分类名称或编码"></el-input> -->
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="文玩娱乐" name="1">
            <ul class="directory-item-ul">
              <li v-for="item in categoryList" :key="item.index">
                {{ item.name }}
              </li>
            </ul>
          </el-collapse-item>
          <el-collapse-item title="生活服务" name="2">
            <ul class="directory-item-ul">
              <li v-for="item in categoryList" :key="item.index">
                {{ item.name }}
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "welcome",
  data() {
    return {
      categoryList: [
        {
          index: 0,
          name: "旅游"
        },
        {
          index: 1,
          name: "酒店"
        },
        {
          index: 2,
          name: "宠物"
        }
      ],
      categoryListShow: [true, false, false, false, false],
      categoryName: "",
      activeName: "1"
    };
  },
  methods: {},
  created() {},
  components: {}
};
</script>

<style lang="less">
.directory-list {
  display: flex;
  margin-top: 20px;
  .directory-item {
    flex: 1;
    height: 400px;
    box-shadow: 0 0 3px #ccc;
    box-sizing: border-box;
    margin-right: 20px;
    box-sizing: border-box;
    opacity: 1;
    &:nth-last-child(1) {
      margin-right: 0;
    }
    &.visible-hidden {
      opacity: 0;
    }
    .directory-item-ul {
      padding: 0 20px;
      li {
        height: 25px;
        line-height: 25px;
        border-bottom: 1px solid #ccc;
        &:hover {
          background-color: #c8e0f0;
          cursor: pointer;
        }
      }
    }
  }
}
</style>