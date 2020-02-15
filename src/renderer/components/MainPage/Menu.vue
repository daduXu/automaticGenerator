<template>
    <el-menu @select="handleSelect" unique-opened :default-active="$route.path" :default-openeds="['/mainPage']">
      <el-submenu index="/mainPage">
        <template slot="title"><i class="el-icon-message"></i>工具</template>
        <el-menu-item-group title="SQL">
          <el-menu-item index="/insert">Insert</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
</template>

<script>
  export default {
    data () {
      return {
        isCollapse: false
      }
    },
    mounted () {
      console.log('111111111111')
    },
    methods: {
      handleSelect (key, keyPath) {
        console.log(key, keyPath)
        if (keyPath.length > 0) {
          const openKey = keyPath[0]
          console.log(openKey)
        }
        this.$router.push({path: keyPath.join('')})
      },
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>

<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
