# -*- mode: ruby -*-
# vi: set ft=ruby :

_conf_defaults = {
  "name" => "project_A",
  "box" => "bento/ubuntu-24.04",
  "ip" => "192.168.33.10",
  "hostIp" => "127.0.0.1",
  "guestPort" => 80,
  "hostPort" => 8080,
  "guestSshPort" => 22,
  "hostSshPort" => 2222,
  "guestBsPort" => 3000, # browser-sync
  "hostBsPort" => 3000 # browser-sync
}

if File.exist?("./vagrant_config.yml")
  _conf_custom = YAML.load(
    File.open(
      "./vagrant_config.yml",
      File::RDONLY
    ).read
  )
  _conf = _conf_defaults.merge!(_conf_custom) if _conf_custom.is_a?(Hash)
else
  _conf = _conf_defaults
end

Vagrant.configure("2") do |config|
  config.vm.box = _conf["box"]

  # ===========
  # Port Forward
  # ===========
  config.vm.network "forwarded_port",
    guest: _conf["guestPort"], host: _conf["hostPort"], host_ip: _conf["hostIp"]

  config.vm.network "forwarded_port",
    guest: _conf["guestBsPort"], host: _conf["hostBsPort"], host_ip: _conf["hostIp"]

  config.vm.network "forwarded_port",
    guest: _conf["guestSshPort"], host: _conf["hostSshPort"],
    auto_correct: true, id: "ssh"

  config.vm.network "private_network", ip: _conf["ip"]

  # ==============
  # Folder Syncing
  # ==============

  # 1) プロジェクト全体を rsync（片方向: ホスト → ゲスト）
  config.vm.synced_folder "./", "/home/vagrant/myproject",
    type: "rsync",
    rsync__exclude: [
      "node_modules/",
      # "gulpkit/",
      # "src/",
      # "dist/"
    ]

  # 2) よく触るフォルダは双方向同期
  config.vm.synced_folder "./gulpkit", "/home/vagrant/myproject/gulpkit"
  config.vm.synced_folder "./src", "/home/vagrant/myproject/src"
  config.vm.synced_folder "./dist", "/home/vagrant/myproject/dist"
  config.vm.synced_folder "./dist", "/var/www/myproject"

  # ===============
  # VirtualBox Settings
  # ===============
  config.vm.provider "virtualbox" do |vb|
    vb.name = _conf["name"]
    vb.memory = "2048"
  end

  # ===============
  # Shell Provision
  # ===============
  config.vm.provision "shell", inline: <<-SHELL

    sudo apt update -y
    sudo apt install -y g++ build-essential git

    # nodejs
    curl -sL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt install -y nodejs
    sudo npm install n -g && n 22.17.0

    # nginx
    sudo apt install -y nginx
    sudo sed -i 's|root /var/www/html;|root /var/www/myproject/development/html;|' \
      /etc/nginx/sites-available/default

    sudo systemctl restart nginx

    cd /home/vagrant/myproject
    sudo npm install
  SHELL
end
