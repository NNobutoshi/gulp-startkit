# -*- mode: ruby -*-
# vi: set ft=ruby :

require 'yaml'

_conf = {
  "ip" => "192.168.33.10",
  "name" => "vagranted",
  "box" => "bento/centos-7.3",
  "guestPort" => 22,
  "hostPort" => 2222,
}

if File.exists?("./config.yml")
  _custom = YAML.load(
    File.open(
      "./config.yml",
      File::RDONLY
    ).read
  )
  _conf.merge!(_custom) if _custom.is_a?(Hash)
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
  config.vm.network "forwarded_port", guest: _conf["guestPort"], host: _conf["hostPort"],host_ip:"127.0.0.1", id: "ssh"

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
  config.vm.synced_folder "./html", "/var/www/html"
  config.vm.synced_folder ".", "/home/vagrant/www"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider "virtualbox" do |vb|
    vb.name = _conf['name']
    # Display the VirtualBox GUI when booting the machine
    # vb.gui = true
    # Customize the amount of memory on the VM:
    # vb.memory = "1024"
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
    sudo yum -y install httpd
    sudo yum install -y gcc gcc-c++ make
    cp -n /etc/httpd/conf/httpd.conf /etc/httpd/conf/httpd_orig.conf
    sed -i -e "\\%<Directory \\"/var/www/html\\">%,\\%</Directory>%s%AllowOverride None%AllowOverride All%g" /etc/httpd/conf/httpd.conf
    sed -i -e "s%#EnableMMAP off%EnableMMAP off%g" /etc/httpd/conf/httpd.conf
    sed -i -e "s%EnableSendfile on%EnableSendfile off%g" /etc/httpd/conf/httpd.conf
    ln -s /home/vagrant/www/package.json /home/vagrant
    ln -s /home/vagrant/www/package-lock.json /home/vagrant
    systemctl enable httpd.service
    systemctl restart httpd.service
    curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -
    sudo yum install -y nodejs-10.7.0
    cd /home/vagrant
    npm install -g gulp@3.9.1
    npm install --save-dev autoprefixer
    npm install --save-dev babel-core
    npm install --save-dev babel-preset-env
    npm install --save-dev babelify
    npm install --save-dev browserify
    npm install --save-dev css-mqpacker
    npm install --save-dev del
    npm install --save-dev gulp@3.9.1
    npm install --save-dev gulp-buffer
    npm install --save-dev gulp-concat
    npm install --save-dev gulp-changed
    npm install --save-dev gulp-eslint
    sudo npm install --save-dev gulp-iconfont
    npm install --save-dev gulp-iconfont-css
    npm install --save-dev gulp-if
    npm install --save-dev gulp-notify
    npm install --save-dev gulp-plumber
    npm install --save-dev gulp-postcss
    npm install --save-dev gulp-sass
    npm install --save-dev gulp-sourcemaps
    npm install --save-dev gulp-tap
    npm install --save-dev gulp-uglify
    npm install --save-dev gulp.spritesmith
    npm install --save-dev js-beautify
    npm install --save-dev merge-stream
    npm install --save-dev pug
    npm install --save-optional browser-sync
    sudo npm install
  SHELL
end
