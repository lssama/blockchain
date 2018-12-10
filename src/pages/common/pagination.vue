<template>
  <div v-if="perShow" class="pagination">
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="propPageSize" :page-size="perPage" layout="prev, pager, next"
      :total="totalPageSize">
    </el-pagination>
    <!-- <p class="color-grey mt20 f-size-12">
      共有{{totalPageSize}}条，每页显示15条
    </p> -->
  </div>
</template>
<script>
  export default {
    props: {
      //  总个数
      totalPageSize: {
        type: Number,
        default: 0,
      },
      //  当前页
      currentPage: {
        type: Number,
        default: 1,
      },
      //  列表size
      perPage: {
        type: Number,
        default: 15,
      },
      //显示
      perShow: {
        type: Boolean,
        default: true,
      },
      noSelectPage: {
        type: Boolean,
        default: false,
      },
      propPageSize: {
        type: Array,
        default: function () {
          return [5, 10, 15, 20];
        },
      },
    },
    data() {
      return {
        pageSize: 15,
        selectPageSize: 10,
        tradePageSize: 5,
        pageNumber: 1,
        userPageSize: 10,
      };
    },
    methods: {
      //每页多少条
      handleSizeChange(val) {
        this.pageSize = val;
        this.userPageSize = val;
        this.pageNumber = 0;
        this.$emit('currentChange', this.$data);
      },
      //  在父组件调用 currentChange 可以拿到当前page, 参考VipClass.vue文件
      handleCurrentChange(val) {
        this.pageNumber = val - 1;
        this.$emit('currentChange', this.$data);
      },
    },
  };
</script>

<style lang="less">
  .pagination {
    margin: 20px 0;
    text-align: center;
    margin-bottom: 40px;
  }
</style>