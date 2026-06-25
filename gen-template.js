import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const menu = [
  {
    name: 'access',
    routes: [
      { name: 'users', title: 'Users' },
      { name: 'roles', title: 'Roles' },
      { name: 'tasks', title: 'Tasks' },
      { name: 'role-task', title: 'Role-Task' },
    ],
  },
  {
    name: 'clinical',
    routes: [
      { name: 'doctors', title: 'Doctors' },
      { name: 'patients', title: 'Patients' },
      { name: 'appointments', title: 'Appointments' },
      { name: 'rooms', title: 'Rooms' },
      { name: 'medicalrecords', title: 'Medical Records' },
    ],
  },
]

const moduleName = process.argv[2]
const routeName = process.argv[3]

function generate(module, route) {
  const configFile = path.resolve(__dirname, 'src', 'app', 'configs', `${route.name}.ts`)
  const configContent = `import { defaultTableConfig } from './_defaults'

const ${route.name}: CRUDCompositeConfig = {
  name: '${route.name}',
  title: '${route.title}',
  view: {
    fields: [],
    list: {
      fields: [],
    },
  },
  transaction: {
    fields: [],
    inputConfig: {},
  },
}
export default ${route.name}
`

  if (!fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, configContent)
    console.log(`generated ${configFile}`)
  } else {
    console.log(`skip ${configFile}`)
  }

  const routeDir = path.resolve(__dirname, 'src', 'views', 'authenticated', module.name, route.name)
  const viewFile = path.join(routeDir, `${route.name}.vue`)

  fs.mkdirSync(routeDir, { recursive: true })

  if (!fs.existsSync(viewFile)) {
    const viewContent = `<script setup lang="ts">
import ${route.name} from '@/app/configs/${route.name}'
</script>

<template>
  <CRUDComposite :config="${route.name}" />
</template>
`
    fs.writeFileSync(viewFile, viewContent)
    console.log(`generated ${viewFile}`)
  } else {
    console.log(`skip ${viewFile}`)
  }
}

if (moduleName && routeName) {
  const mod = menu.find((m) => m.name === moduleName)
  if (!mod) {
    console.error(`Module "${moduleName}" not found. Available: ${menu.map((m) => m.name).join(', ')}`)
    process.exit(1)
  }
  const route = mod.routes.find((r) => r.name === routeName)
  if (!route) {
    console.error(`Route "${routeName}" not found in module "${moduleName}". Available: ${mod.routes.map((r) => r.name).join(', ')}`)
    process.exit(1)
  }
  generate(mod, route)
} else {
  console.log('Usage: node gen-template.js <module> <route>')
  console.log('Examples:')
  console.log('  node gen-template.js clinical doctors')
  console.log('  node gen-template.js access users')
}
