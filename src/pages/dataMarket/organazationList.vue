<template>
  <el-dialog class="organazation-list" title="结构列表" width="20%" :visible="dialogVisible" :before-close="handleClose">
    <el-tree
      :data="list"
      show-checkbox
      node-key="Index"
      @check-change="checkChange"
      default-expand-all
      :props="defaultProps">
    </el-tree>
  </el-dialog>
</template>

<script>
  export default {
    name: 'organazationList',
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'Title'
        }
      }
    },
    props: {
      dialogVisible: {
        type: Boolean,
        required: true,
      },
      list: {
        type: Array,
        required: true,
      },
    },
    methods: {
      handleClose() {
        this.$emit('close');
      },
      checkChange(item, isCheck) {
        if (isCheck) {
          
        }
      }
    },
    created() {
    },
    components: {
    }
  }
</script>

<style lang="less">
  .organazation-list {}
</style>