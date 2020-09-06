// eslint-disable-next-line no-unused-vars
const user = process.env.CODER_USER || 'coder';

module.exports = {
  node_lts: {
    initOnly: true,
    incompatible: ['node_10', 'node_12', 'node_14'],
    commands: () => [
      'curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -',
      'sudo apt-get install -y nodejs',
    ],
  },
  node_14: {
    initOnly: true,
    incompatible: ['node_10', 'node_12', 'node_lts'],
    commands: () => [
      'curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -',
      'sudo apt-get install -y nodejs',
    ],
  },
  node_12: {
    initOnly: true,
    incompatible: ['node_10', 'node_lts', 'node_14'],
    commands: () => [
      'curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -',
      'sudo apt-get install -y nodejs',
    ],
  },
  node_10: {
    initOnly: true,
    incompatible: ['node_lts', 'node_12', 'node_14'],
    commands: () => [
      'curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -',
      'sudo apt-get install -y nodejs',
    ],
  },
  'golang_1.15': {
    initOnly: true,
    incompatible: [],
    commands: () => [
      'curl -sL https://golang.org/dl/go1.15.1.linux-amd64.tar.gz | sudo tar -C /usr/local -xz',
      'sudo mv /usr/local/go/bin/* /usr/local/bin/',
    ],
  },
  fix_project_dir: {
    initOnly: true,
    hidden: true,
    required: true,
    commands: (project) => [
      `sudo chown -R ${user}:${user} /home/${user}/${project.folderName}`,
    ],
  },
};
