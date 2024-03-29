# -*- mode: ruby -*-
# vi: set ft=ruby :

_conf_defaults = {
  "ip" => "192.168.33.10",
  "name" => "project_A",
  "box" => "generic/ubuntu2010",
  "guestPort" => 22,
  "hostPort" => 2222,
  "bsPort" => 3000,
}

if File.exists?("./vagrant_config.yml")
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

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = _conf["box"]

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: _conf["guestPort"], host: _conf["hostPort"], auto_correct: true, host_ip:"127.0.0.1", id: "ssh"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: _conf["ip"]

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.

  config.vm.synced_folder "./", "/home/vagrant/myproject", type: "rsync", rsync__exclude: "node_modules/"
  config.vm.synced_folder "./gulpkit.js", "/home/vagrant/myproject/gulpkit.js"
  config.vm.synced_folder "./src", "/home/vagrant/myproject/src"
  config.vm.synced_folder "./dist", "/home/vagrant/myproject/dist"
  config.vm.synced_folder "./dist/development/html", "/var/www/html"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider "virtualbox" do |vb|
    vb.name = _conf["name"]
    # Display the VirtualBox GUI when booting the machine
    # vb.gui = true
    # Customize the amount of memory on the VM:
    vb.memory = "4096"
  end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Define a Vagrant Push strategy for pushing to Atlas. Other push strategies
  # such as FTP and Heroku are also available. See the documentation at
  # https://docs.vagrantup.com/v2/push/atlas.html for more information.
  # config.push.define "atlas" do |push|
  #   push.app = "YOUR_ATLAS_USERNAME/YOUR_APPLICATION_NAME"
  # end

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  config.vm.provision "shell", inline: <<-SHELL

    sudo apt update -y
    sudo apt install -y g++ build-essential
    sudo apt install -y git

    # nodejs
    curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt install -y nodejs

    # nginx
    sudo apt install -y nginx
    yes | sudo ufw enable
    sudo ufw allow #{ _conf["guestPort"] }
    sudo ufw allow #{ _conf["hostPort"] }
    sudo ufw allow #{ _conf["bsPort"] }
    sudo ufw allow 'Nginx Full'
    sudo ufw reload

    cd /home/vagrant/myproject
    sudo npm install
  SHELL
end
